import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import { CustomSheet } from "@/components/modules/custom-sheet";
import { Fallback } from "@/components/modules/fallback";
import { TableSkeleton } from "@/components/modules/skeleton";
import { Button } from "@/components/ui/button";
import { SyntaxCode } from "@/components/ui/syntax-code";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
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
			<div className="space-y-6">
				{error && <Fallback tone="error" title="Could not load API logs" description={error} />}
				<ModularCard title="Requests" content>
					{loading ? (
						<TableSkeleton />
					) : logs.length > 0 ? (
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
											<TableCell>
												<Typography as="span" variant="caption" className="font-mono text-white/60">
													{log.requestId}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography as="span" className="text-white/70">
													{log.operation}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography as="span" className="text-white/70">
													{log.source}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography as="span" className="text-white/55">
													{new Date(log.createdAt).toLocaleString()}
												</Typography>
											</TableCell>
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
					) : (
						<Fallback
							title="No API requests yet"
							description="Requests made in this project and environment will appear here."
						/>
					)}
				</ModularCard>
				<CustomSheet
					open={Boolean(selected)}
					onOpenChange={(open) => !open && setSelected(null)}
					title={selected ? selected.operation : "API request"}
					description={selected ? `Request ${selected.requestId}` : undefined}
				>
					{selected && (
						<SyntaxCode
							code={JSON.stringify(selected, null, 2)}
							language="json"
							label="request.json"
						/>
					)}
				</CustomSheet>
			</div>
		</DashboardLayout>
	);
}
