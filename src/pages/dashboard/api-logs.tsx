import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCurrentProject } from "@/hooks/use-current-project";
import { type FinancialLog, listFinancialLogs } from "@/services/financial.service";
import { useEffect, useState } from "react";

export default function ApiLogsPage() {
	const { project, environment } = useCurrentProject();
	const [logs, setLogs] = useState<FinancialLog[]>([]);
	const [selected, setSelected] = useState<FinancialLog | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		let cancelled = false;
		setLogs([]);
		setSelected(null);
		setError(null);

		if (!project) return;
		setLoading(true);
		listFinancialLogs(project.id)
			.then((items) => {
				if (!cancelled) setLogs(items);
			})
			.catch((reason) => {
				if (!cancelled) setError(reason instanceof Error ? reason.message : "Could not load logs");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [project?.id, environment]);

	return (
		<DashboardLayout
			title="API Logs"
			description="Trace application and provider requests. Logs are retained for seven days."
		>
			{error && (
				<p role="alert" className="text-red-300">
					{error}
				</p>
			)}
			<ModularCard title="Requests" content>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{["Request ID", "Operation", "Source", "Created", "Action"].map((label) => (
									<TableHead key={label}>{label}</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{logs.map((log) => (
								<TableRow key={log.id}>
									<TableCell className="font-mono text-xs">{log.requestId}</TableCell>
									<TableCell>{log.operation}</TableCell>
									<TableCell>{log.source}</TableCell>
									<TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
									<TableCell>
										<Button size="sm" variant="outline" onClick={() => setSelected(log)}>
											Inspect
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{!logs.length && (
					<p className="py-6 text-sm text-gray-400">
						{loading ? "Loading requests…" : "No requests in this environment yet."}
					</p>
				)}
			</ModularCard>
			{selected && (
				<ModularCard title="Request details" content>
					<pre className="max-h-96 overflow-auto rounded-md bg-black/30 p-4 text-xs">
						{JSON.stringify(selected, null, 2)}
					</pre>
				</ModularCard>
			)}
		</DashboardLayout>
	);
}
