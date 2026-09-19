import { Fallback } from "@/components/modules/fallback";
import { CardGridSkeleton, TableSkeleton } from "@/components/modules/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useCurrentProject } from "@/hooks/use-current-project";
import {
	type ConnectedPaymentProvider,
	type ProviderOverview,
	getProviderOverview,
} from "@/services/provider-activity.service";
import { listProjectProviders } from "@/services/provider.service";
import { RefreshCw, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const providerNames: Record<ConnectedPaymentProvider, string> = {
	paystack: "Paystack",
	flutterwave: "Flutterwave",
	mono: "Mono",
};

function formatAmount(amount: string | null, currency: string | null): string {
	if (amount === null || currency === null) return "—";
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
	}).format(Number(amount));
}

function ActivityList({
	title,
	items,
}: {
	title: string;
	items: ProviderOverview["payments"] | ProviderOverview["payouts"];
}) {
	return (
		<Card className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none">
			<CardHeader className="border-b border-white/[0.07] px-5 py-4">
				<Typography variant="subheading">{title}</Typography>
			</CardHeader>
			<CardContent className="p-5">
				{items.state === "unavailable" || !items.data ? (
					<Typography variant="bodySmall">{items.message ?? "No data is available."}</Typography>
				) : items.data.length === 0 ? (
					<Typography variant="bodySmall">No recent activity.</Typography>
				) : (
					<div className="space-y-3">
						{items.data.slice(0, 5).map((item) => (
							<div
								key={`${item.id}-${item.reference ?? ""}`}
								className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
							>
								<div className="min-w-0">
									<Typography variant="label" className="block truncate text-white/80">
										{item.reference ?? item.id}
									</Typography>
									<Typography variant="caption" className="block">
										{item.occurredAt
											? new Date(item.occurredAt).toLocaleString()
											: "Time unavailable"}
									</Typography>
								</div>
								<div className="shrink-0 text-right">
									<Typography variant="label" className="block text-white/80">
										{formatAmount(item.amount, item.currency)}
									</Typography>
									<Badge
										variant="outline"
										className="mt-1 border-white/10 text-[10px] text-white/45"
									>
										{item.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ProviderActivityOverview() {
	const { project, environment } = useCurrentProject();
	const [snapshots, setSnapshots] = useState<
		Record<ConnectedPaymentProvider, ProviderOverview | null>
	>({
		paystack: null,
		flutterwave: null,
		mono: null,
	});
	const [providers, setProviders] = useState<ConnectedPaymentProvider[]>([]);
	const [selected, setSelected] = useState<ConnectedPaymentProvider | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = async () => {
		if (!project || environment !== "production") return;
		setLoading(true);
		setError(null);
		try {
			const connections = await listProjectProviders(project.id);
			const connected = connections
				.filter((connection) => connection.isActive && connection.isVerified === true)
				.map((connection) => String(connection.type))
				.filter(
					(type): type is ConnectedPaymentProvider =>
						type === "paystack" || type === "flutterwave" || type === "mono",
				);
			setProviders(connected);
			setSelected((current) =>
				current && connected.includes(current) ? current : (connected[0] ?? null),
			);
			const results = await Promise.all(
				connected.map(
					async (provider) => [provider, await getProviderOverview(project.id, provider)] as const,
				),
			);
			setSnapshots((current) => ({
				...current,
				...Object.fromEntries(results),
			}));
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Could not load provider activity");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void load();
	}, [project?.id, environment]);

	const overview = selected ? snapshots[selected] : null;
	const counts = useMemo(
		() =>
			Object.values(snapshots).reduce(
				(total, snapshot) => ({
					transactions: total.transactions + (snapshot?.totals.data?.transactionCount ?? 0),
					wallets: total.wallets + (snapshot?.virtualAccounts.data?.length ?? 0),
					pendingPayouts: total.pendingPayouts + (snapshot?.totals.data?.pendingPayouts ?? 0),
				}),
				{ transactions: 0, wallets: 0, pendingPayouts: 0 },
			),
		[snapshots],
	);

	if (loading) return <CardGridSkeleton cards={4} />;
	if (error)
		return (
			<Fallback
				tone="error"
				title="Provider activity is unavailable"
				description={error}
				action={{ label: "Try again", onClick: () => void load() }}
			/>
		);
	if (providers.length === 0)
		return (
			<Fallback
				title="Connect a provider to view live activity"
				description="Connect and validate a Production Paystack, Flutterwave, or Mono account to view its live summary."
			/>
		);
	if (!overview) return <TableSkeleton />;

	return (
		<section className="space-y-6" aria-label="Live provider activity">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<Typography variant="heading">Live provider activity</Typography>
					<Typography className="mt-1">
						Fetched from your connected provider account and not retained by OurPocket.
					</Typography>
				</div>
				<Button type="button" variant="outline" onClick={() => void load()}>
					<RefreshCw className="size-4" aria-hidden="true" /> Refresh
				</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				{providers.map((provider) => (
					<Button
						key={provider}
						type="button"
						variant={provider === selected ? "default" : "outline"}
						onClick={() => setSelected(provider)}
					>
						{providerNames[provider]}
					</Button>
				))}
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					["Connected providers", String(providers.length)],
					["Provider transactions", String(counts.transactions)],
					["Active virtual accounts", String(counts.wallets)],
					["Pending payouts", String(counts.pendingPayouts)],
				].map(([label, value]) => (
					<Card
						key={label}
						className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none"
					>
						<CardContent className="p-5">
							<Typography variant="label">{label}</Typography>
							<Typography variant="title" className="mt-5 block">
								{value}
							</Typography>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-2">
				<Card className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none">
					<CardHeader className="border-b border-white/[0.07] px-5 py-4">
						<Typography variant="subheading">Balances</Typography>
					</CardHeader>
					<CardContent className="p-5">
						{overview.balances.data?.length ? (
							overview.balances.data.map((balance) => (
								<div
									key={balance.currency}
									className="flex justify-between border-b border-white/[0.06] py-3 first:pt-0 last:border-0 last:pb-0"
								>
									<Typography variant="bodySmall">{balance.currency}</Typography>
									<Typography variant="label">{balance.available ?? "—"}</Typography>
								</div>
							))
						) : (
							<Typography variant="bodySmall">
								{overview.balances.message ?? "No balance data is available."}
							</Typography>
						)}
					</CardContent>
				</Card>
				<Card className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none">
					<CardHeader className="border-b border-white/[0.07] px-5 py-4">
						<Typography variant="subheading">Virtual accounts</Typography>
					</CardHeader>
					<CardContent className="p-5">
						{overview.virtualAccounts.data?.length ? (
							overview.virtualAccounts.data.map((account) => (
								<div
									key={account.id}
									className="flex items-center justify-between border-b border-white/[0.06] py-3 first:pt-0 last:border-0 last:pb-0"
								>
									<div>
										<Typography variant="label" className="block text-white/80">
											{account.bankName ?? "Provider account"}
										</Typography>
										<Typography variant="caption">
											{account.maskedAccountNumber ?? "Account details unavailable"}
										</Typography>
									</div>
									<Badge variant="outline" className="border-white/10 text-[10px] text-white/45">
										{account.status}
									</Badge>
								</div>
							))
						) : (
							<Typography variant="bodySmall">
								{overview.virtualAccounts.message ?? "No virtual accounts are available."}
							</Typography>
						)}
					</CardContent>
				</Card>
				<ActivityList title="Recent payments" items={overview.payments} />
				<ActivityList title="Recent payouts" items={overview.payouts} />
			</div>
			<Typography variant="caption" className="flex items-center gap-1.5">
				<WalletCards className="size-3" aria-hidden="true" /> Refreshed{" "}
				{new Date(overview.fetchedAt).toLocaleString()}
			</Typography>
		</section>
	);
}

export { ProviderActivityOverview };
