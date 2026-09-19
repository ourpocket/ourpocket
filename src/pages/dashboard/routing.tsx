import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import { DashboardSkeleton } from "@/components/modules/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useCurrentProject } from "@/hooks/use-current-project";
import {
	type ProviderHealth,
	type ReconciliationRun,
	type RoutingPolicy,
	getRoutingPolicy,
	listProviderHealth,
	listReconciliationRuns,
	runReconciliation,
	saveProviderHealth,
	saveRoutingPolicy,
} from "@/services/financial.service";
import { Activity, RefreshCw, Route, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const strategies: Array<{ value: RoutingPolicy["strategy"]; label: string; detail: string }> = [
	{
		value: "best_success_rate",
		label: "Best success rate",
		detail: "Compare settled payment outcomes. With no history, use your priority order.",
	},
	{
		value: "lowest_fees",
		label: "Lowest fees",
		detail: "Compare configured fee estimates. With no estimates, use your priority order.",
	},
	{
		value: "fastest_response",
		label: "Fastest response",
		detail: "Compare recorded response latency. With no measurements, use your priority order.",
	},
	{
		value: "custom_priority",
		label: "Custom priority",
		detail: "Use the provider order configured below.",
	},
];

function RoutingContent() {
	const { project, environment } = useCurrentProject();
	const [policy, setPolicy] = useState<RoutingPolicy | null>(null);
	const [health, setHealth] = useState<ProviderHealth[]>([]);
	const [runs, setRuns] = useState<ReconciliationRun[]>([]);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const loadSequence = useRef(0);

	const load = useCallback(async () => {
		const sequence = ++loadSequence.current;
		if (!project) return;
		setLoading(true);
		try {
			const [nextPolicy, nextHealth, nextRuns] = await Promise.all([
				getRoutingPolicy(project.id),
				listProviderHealth(project.id),
				listReconciliationRuns(project.id),
			]);
			if (sequence === loadSequence.current) {
				setPolicy(nextPolicy);
				setHealth(nextHealth);
				setRuns(nextRuns);
			}
		} catch (error) {
			if (sequence === loadSequence.current)
				toast.error(error instanceof Error ? error.message : "Could not load routing controls");
		} finally {
			if (sequence === loadSequence.current) setLoading(false);
		}
	}, [project, environment]);

	useEffect(() => {
		void load();
	}, [load]);

	if (loading || !policy) return <DashboardSkeleton />;

	const save = async () => {
		if (!project) return;
		setBusy(true);
		try {
			setPolicy(await saveRoutingPolicy(project.id, policy));
			toast.success("Routing policy saved");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save routing policy");
		} finally {
			setBusy(false);
		}
	};

	const reconcile = async () => {
		if (!project) return;
		setBusy(true);
		try {
			const run = await runReconciliation(project.id);
			setRuns((current) => [run, ...current]);
			toast.success(`Inspected ${run.inspected} operations`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Reconciliation failed");
		} finally {
			setBusy(false);
		}
	};

	const saveHealth = async (provider: ProviderHealth) => {
		if (!project) return;
		setBusy(true);
		try {
			await saveProviderHealth(project.id, provider.provider, {
				status: provider.status === "unknown" ? "healthy" : provider.status,
				estimatedFeeBps: provider.estimatedFeeBps,
			});
			setHealth(await listProviderHealth(project.id));
			toast.success(`${provider.provider} routing signals saved`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save provider signals");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2">
				{health.map((provider) => (
					<article
						key={provider.provider}
						className="rounded-xl border border-white/[0.08] bg-[#1b1b1b] p-5"
					>
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.04] text-orange-300">
									<Activity className="size-4" aria-hidden="true" />
								</div>
								<Typography variant="subheading" className="capitalize">
									{provider.provider}
								</Typography>
							</div>
							<Badge variant="outline">
								{provider.connected ? provider.status : "not connected"}
							</Badge>
						</div>
						<div className="mt-4 grid gap-3 border-t border-white/[0.07] pt-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
							<Label className="grid gap-2 text-xs text-white/60">
								Operator status
								<Select
									value={provider.status === "unknown" ? "healthy" : provider.status}
									onValueChange={(status) =>
										setHealth((current) =>
											current.map((item) =>
												item.provider === provider.provider
													? { ...item, status: status as ProviderHealth["status"] }
													: item,
											),
										)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="healthy">Healthy</SelectItem>
										<SelectItem value="degraded">Degraded</SelectItem>
										<SelectItem value="down">Down</SelectItem>
									</SelectContent>
								</Select>
							</Label>
							<Label className="grid gap-2 text-xs text-white/60">
								Estimated fee (bps)
								<Input
									type="number"
									min={0}
									max={10000}
									step={1}
									value={provider.estimatedFeeBps ?? ""}
									onChange={(event) =>
										setHealth((current) =>
											current.map((item) =>
												item.provider === provider.provider
													? {
															...item,
															estimatedFeeBps:
																event.target.value === "" ? null : Number(event.target.value),
														}
													: item,
											),
										)
									}
								/>
							</Label>
							<Button disabled={busy} variant="outline" onClick={() => void saveHealth(provider)}>
								Save
							</Button>
						</div>
						<div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4">
							<div>
								<Typography variant="caption">Success · {provider.settledCount} settled</Typography>
								<Typography variant="subheading">
									{provider.connected || environment === "sandbox"
										? provider.successRate === null
											? "—"
											: `${provider.successRate}%`
										: "—"}
								</Typography>
							</div>
							<div>
								<Typography variant="caption">Latency · {provider.latencyCount} calls</Typography>
								<Typography variant="subheading">
									{provider.p95LatencyMs === null ? "—" : `${provider.p95LatencyMs} ms`}
								</Typography>
							</div>
							<div>
								<Typography variant="caption">Fee</Typography>
								<Typography variant="subheading">
									{provider.estimatedFeeBps === null ? "—" : `${provider.estimatedFeeBps} bps`}
								</Typography>
							</div>
						</div>
					</article>
				))}
			</div>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.7fr)]">
				<ModularCard title="Payment routing policy" content>
					<div className="space-y-6">
						<div className="rounded-lg border border-orange-300/15 bg-orange-300/[0.04] p-4">
							<div className="flex gap-3">
								<Route className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
								<Typography>
									Each selection is stored on the payment with the policy, candidates, health
									snapshot, and reason.
								</Typography>
							</div>
						</div>
						<Label className="grid gap-2">
							Routing strategy
							<Select
								value={policy.strategy}
								onValueChange={(value) =>
									setPolicy((current) =>
										current
											? { ...current, strategy: value as RoutingPolicy["strategy"] }
											: current,
									)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{strategies.map((strategy) => (
										<SelectItem key={strategy.value} value={strategy.value}>
											{strategy.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Typography variant="caption">
								{strategies.find((item) => item.value === policy.strategy)?.detail}
							</Typography>
						</Label>
						<Label className="grid gap-2">
							Primary provider
							<Select
								value={policy.providerPriority[0] ?? "paystack"}
								onValueChange={(value) =>
									setPolicy((current) =>
										current
											? {
													...current,
													providerPriority:
														value === "paystack"
															? ["paystack", "flutterwave"]
															: ["flutterwave", "paystack"],
												}
											: current,
									)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="paystack">Paystack</SelectItem>
									<SelectItem value="flutterwave">Flutterwave</SelectItem>
								</SelectContent>
							</Select>
						</Label>
						<div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.07] p-4">
							<div>
								<Typography variant="subheading">Require a healthy provider</Typography>
								<Typography variant="caption">Exclude providers explicitly marked down.</Typography>
							</div>
							<Switch
								checked={policy.requireHealthy}
								onCheckedChange={(checked) =>
									setPolicy((current) =>
										current ? { ...current, requireHealthy: checked } : current,
									)
								}
							/>
						</div>
						<div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.07] p-4">
							<div>
								<Typography variant="subheading">Safe pre-request failover</Typography>
								<Typography variant="caption">
									Failover applies before a provider accepts a write. Unknown outcomes always enter
									reconciliation.
								</Typography>
							</div>
							<Switch
								checked={policy.safeFailover}
								onCheckedChange={(checked) =>
									setPolicy((current) =>
										current ? { ...current, safeFailover: checked } : current,
									)
								}
							/>
						</div>
						<Button onClick={() => void save()} disabled={busy}>
							Save routing policy
						</Button>
					</div>
				</ModularCard>

				<ModularCard title="Reconciliation" content>
					<div className="space-y-5">
						<div className="flex size-10 items-center justify-center rounded-lg bg-white/[0.04] text-orange-300">
							<ShieldCheck className="size-5" aria-hidden="true" />
						</div>
						<Typography>
							Verify pending and unknown production payments against their original provider. The
							control plane never repeats the financial write.
						</Typography>
						<Button
							onClick={() => void reconcile()}
							disabled={busy || environment !== "production"}
						>
							<RefreshCw className={busy ? "animate-spin" : ""} aria-hidden="true" />
							Run reconciliation
						</Button>
						{environment === "sandbox" && (
							<Typography variant="caption">
								Switch to Production to reconcile provider operations.
							</Typography>
						)}
						<div className="space-y-2 border-t border-white/[0.07] pt-4">
							{runs.slice(0, 5).map((run) => (
								<div
									key={run.id}
									className="flex items-center justify-between rounded-lg bg-black/15 p-3"
								>
									<div>
										<Typography variant="bodySmall">
											{new Date(run.createdAt).toLocaleString()}
										</Typography>
										<Typography variant="caption">
											{run.inspected} inspected · {run.resolved} resolved
										</Typography>
									</div>
									<Badge variant="outline">{run.unresolved} open</Badge>
								</div>
							))}
							{runs.length === 0 && (
								<Typography variant="caption">No reconciliation runs yet.</Typography>
							)}
						</div>
					</div>
				</ModularCard>
			</div>
		</div>
	);
}

export default function RoutingPage() {
	return (
		<DashboardLayout
			title="Routing & reconciliation"
			description="Choose providers by policy, inspect every decision, and resolve uncertain outcomes safely."
		>
			<RoutingContent />
		</DashboardLayout>
	);
}
