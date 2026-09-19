import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SyntaxCode } from "@/components/ui/syntax-code";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCurrentProject } from "@/hooks/use-current-project";
import { useEnvironment, useSelectedProjectId } from "@/lib/environment";
import { apiRequest } from "@/services/api-client";
import {
	type FinancialDelivery,
	listDeliveries,
	replayDelivery,
	sendTestEvent,
} from "@/services/financial.service";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { z } from "zod";

const endpointSchema = z.object({
	id: z.uuid(),
	url: z.url(),
	eventTypes: z.array(z.string()).nullable(),
	isActive: z.boolean(),
	secret: z.string().optional(),
	createdAt: z.string(),
});

type Endpoint = z.infer<typeof endpointSchema>;

function WebhooksContent() {
	const { project, environment } = useCurrentProject();
	const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
	const [deliveries, setDeliveries] = useState<FinancialDelivery[]>([]);
	const [selected, setSelected] = useState<FinancialDelivery | null>(null);
	const [secret, setSecret] = useState<string | null>(null);
	const [url, setUrl] = useState("");
	const [filters, setFilters] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!project) return;

		const [hooks, history] = await Promise.all([
			apiRequest<unknown>(`/projects/${project.id}/financial/webhooks`),
			listDeliveries(project.id),
		]);

		setEndpoints(z.array(endpointSchema).parse(hooks));
		setDeliveries(history);
	}, [project?.id, environment]);

	useEffect(() => {
		let cancelled = false;
		setEndpoints([]);
		setDeliveries([]);
		setSelected(null);
		setSecret(null);
		setError(null);

		if (!project) return;
		setLoading(true);
		Promise.all([
			apiRequest<unknown>(`/projects/${project.id}/financial/webhooks`),
			listDeliveries(project.id),
		])
			.then(([hooks, history]) => {
				if (!cancelled) {
					setEndpoints(z.array(endpointSchema).parse(hooks));
					setDeliveries(history);
				}
			})
			.catch((reason) => {
				if (!cancelled)
					setError(reason instanceof Error ? reason.message : "Could not load webhooks");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [project?.id, environment]);

	async function run(action: () => Promise<void>) {
		setBusy(true);
		setError(null);

		try {
			await action();
			await refresh();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Request failed");
		} finally {
			setBusy(false);
		}
	}

	async function create(event: FormEvent) {
		event.preventDefault();

		if (!project) return;
		await run(async () => {
			const endpoint = endpointSchema.parse(
				await apiRequest<unknown>(`/projects/${project.id}/financial/webhooks`, {
					method: "POST",
					body: JSON.stringify({ url, events: filters }),
				}),
			);

			setSecret(endpoint.secret ?? null);
			setUrl("");
		});
	}

	return (
		<DashboardLayout
			title="Webhooks"
			description="Inspect, test, and replay signed event deliveries."
			actionTab={
				<ModularModals trigger={<Button>Add Endpoint</Button>}>
					<form className="space-y-4" onSubmit={create}>
						<Label className="grid gap-2">
							Endpoint URL
							<Input
								aria-label="Endpoint URL"
								type="url"
								value={url}
								onChange={(event) => setUrl(event.target.value)}
								placeholder="https://api.yourapp.com/webhooks"
								required
							/>
						</Label>
						<Label className="grid gap-2">
							Event filters
							<Input
								aria-label="Event filters"
								value={filters}
								onChange={(event) => setFilters(event.target.value)}
								placeholder="payment.completed,refund.completed"
							/>
						</Label>
						<p className="text-xs text-gray-400">Leave filters empty to receive all events.</p>
						<Button type="submit" disabled={busy}>
							Save endpoint
						</Button>
						{secret && (
							<p role="status" className="break-all text-sm">
								Save this signing secret now: <code>{secret}</code>
							</p>
						)}
						{error && (
							<p role="alert" className="text-red-300">
								{error}
							</p>
						)}
					</form>
				</ModularModals>
			}
		>
			<div className="space-y-6">
				{error && (
					<p role="alert" className="text-red-300">
						{error}
					</p>
				)}
				{secret && (
					<ModularCard title="New signing secret" content>
						<p className="mb-3 text-sm text-gray-400">
							Shown only when created. Save this secret in your endpoint server.
						</p>
						<code className="break-all text-sm">{secret}</code>
						<Button
							variant="outline"
							className="ml-3"
							onClick={() => void navigator.clipboard.writeText(secret)}
						>
							Copy
						</Button>
					</ModularCard>
				)}
				<div className="flex gap-3">
					<Button variant="outline" disabled={busy || !project} onClick={() => void run(refresh)}>
						Refresh deliveries
					</Button>
					{environment === "sandbox" && (
						<Button
							disabled={busy || !project}
							onClick={() => {
								if (project)
									void run(async () => {
										await sendTestEvent(project.id);
									});
							}}
						>
							Send test event
						</Button>
					)}
				</div>
				<ModularCard title="Webhook endpoints" content>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									{["Endpoint ID", "Events", "Endpoint", "Status", "Health", "Action"].map(
										(label) => (
											<TableHead key={label}>{label}</TableHead>
										),
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{endpoints.map((endpoint) => (
									<TableRow key={endpoint.id}>
										<TableCell className="font-mono text-xs">{endpoint.id}</TableCell>
										<TableCell>
											{endpoint.eventTypes?.length ? endpoint.eventTypes.join(", ") : "All events"}
										</TableCell>
										<TableCell className="max-w-64 truncate">{endpoint.url}</TableCell>
										<TableCell>
											<Badge variant="outline">{endpoint.isActive ? "Active" : "Inactive"}</Badge>
										</TableCell>
										<TableCell>
											{deliveries.find((delivery) => delivery.webhookId === endpoint.id)?.status ??
												"No deliveries"}
										</TableCell>
										<TableCell>
											<Button
												size="sm"
												variant="outline"
												disabled={busy || !endpoint.isActive}
												onClick={() => {
													if (project)
														void run(async () => {
															await apiRequest(
																`/projects/${project.id}/financial/webhooks/${endpoint.id}`,
																{ method: "DELETE" },
															);
														});
												}}
											>
												Deactivate
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					{!endpoints.length && (
						<p className="py-6 text-sm text-gray-400">
							{loading ? "Loading endpoints…" : "No webhook endpoints in this environment."}
						</p>
					)}
				</ModularCard>
				<ModularCard title="Delivery history" content>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									{["Delivery ID", "Event ID", "Status", "Attempts", "Action"].map((label) => (
										<TableHead key={label}>{label}</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{deliveries.map((delivery) => (
									<TableRow key={delivery.id}>
										<TableCell className="font-mono text-xs">{delivery.id}</TableCell>
										<TableCell className="font-mono text-xs">{delivery.eventId}</TableCell>
										<TableCell>{delivery.status}</TableCell>
										<TableCell>{delivery.attempts}</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button size="sm" variant="outline" onClick={() => setSelected(delivery)}>
													Inspect
												</Button>
												<Button
													size="sm"
													disabled={busy}
													onClick={() => {
														if (project)
															void run(async () => {
																await replayDelivery(project.id, delivery.id);
															});
													}}
												>
													Replay
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					{!deliveries.length && (
						<p className="py-6 text-sm text-gray-400">
							No deliveries yet. Events will appear after the delivery worker processes them.
						</p>
					)}
				</ModularCard>
				{selected && (
					<ModularCard title="Delivery response inspection" content>
						<SyntaxCode
							code={JSON.stringify(selected, null, 2)}
							language="json"
							label="delivery.json"
						/>
					</ModularCard>
				)}
			</div>
		</DashboardLayout>
	);
}

export default function WebhooksPage() {
	const environment = useEnvironment();
	const projectId = useSelectedProjectId();

	return <WebhooksContent key={`${projectId}:${environment}`} />;
}
