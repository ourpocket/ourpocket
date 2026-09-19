"use client";

import { DashboardSkeleton } from "@/components/modules/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentProject } from "@/hooks/use-current-project";
import { useUsageMetrics } from "@/hooks/use-usage-metrics";
import type { UsageMetrics } from "@/services/types";
import { Activity, DollarCircle, UserOctagon, Wallet } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

interface StatCardProps {
	title: string;
	value: string;
	Icon: typeof DollarCircle;
}

const emptyMetrics: UsageMetrics = {
	totals: {
		apiRequests: 0,
		successfulTransactions: 0,
		failedTransactions: 0,
		activeWallets: 0,
		transactionVolume: 0,
		successRate: 0,
	},
	providerPerformance: [],
	monthlyTransactionVolume: [],
	apiUsage: [],
};

const StatCard = ({ title, value, Icon }: StatCardProps) => {
	return (
		<Card className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none">
			<CardContent className="p-5">
				<div className="mb-5 flex items-center justify-between">
					<p className="text-xs font-medium text-white/45">{title}</p>
					<div className="flex size-8 items-center justify-center rounded-lg bg-orange-400/[0.08] text-orange-300">
						<Icon size={17} variant="Bulk" />
					</div>
				</div>
				<p className="text-2xl font-semibold tracking-[-0.02em] text-white">{value}</p>
			</CardContent>
		</Card>
	);
};

const ChartCard = ({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle: string;
	children: ReactNode;
}) => (
	<Card className="gap-0 rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none">
		<CardHeader className="border-b border-white/[0.07] px-5 py-4">
			<div>
				<h3 className="text-sm font-semibold text-white">{title}</h3>
				<p className="mt-1 text-xs text-white/40">{subtitle}</p>
			</div>
		</CardHeader>
		<CardContent className="p-5">
			<div className="h-64 sm:h-72">{children}</div>
		</CardContent>
	</Card>
);

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(value);

const formatNumber = (value: number) =>
	new Intl.NumberFormat("en-NG", {
		maximumFractionDigits: 1,
	}).format(value);

export default function DashboardOverview() {
	const { project, isLoading } = useCurrentProject();
	const { getUsageMetrics } = useUsageMetrics();
	const [metrics, setMetrics] = useState<UsageMetrics>(emptyMetrics);

	useEffect(() => {
		let isMounted = true;
		setMetrics(emptyMetrics);

		async function loadMetrics() {
			if (!project) {
				return;
			}

			try {
				const response = await getUsageMetrics(project.id);

				if (isMounted) {
					setMetrics(response);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load metrics";
				toast.error(message);
			}
		}

		void loadMetrics();

		return () => {
			isMounted = false;
		};
	}, [project]);

	const stats = [
		{
			title: "Total Transaction",
			value: formatCurrency(metrics.totals.transactionVolume),
			Icon: DollarCircle,
		},
		{
			title: "API Requests",
			value: formatNumber(metrics.totals.apiRequests),
			Icon: Activity,
		},
		{
			title: "Active Wallets",
			value: formatNumber(metrics.totals.activeWallets),
			Icon: Wallet,
		},
		{
			title: "Success Rate",
			value: `${metrics.totals.successRate}%`,
			Icon: UserOctagon,
		},
	];

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<StatCard key={stat.title} {...stat} />
				))}
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				<ChartCard title="Transaction Volume" subtitle="Monthly transaction volume and count">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={metrics.monthlyTransactionVolume}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: "#6B7280" }}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: "#6B7280" }}
								tickFormatter={(value) => `${value / 1000000}M`}
							/>
							<Bar dataKey="value" fill="#fb8a2e" radius={[5, 5, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="API Usage" subtitle="Daily API requests over the past week">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={metrics.apiUsage} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<XAxis
								dataKey="day"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: "#6B7280" }}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: "#6B7280" }}
								tickFormatter={(value) => `${value / 1000}K`}
							/>
							<Line
								type="monotone"
								dataKey="requests"
								stroke="#fb8a2e"
								strokeWidth={2}
								dot={{ fill: "#fb8a2e", strokeWidth: 0, r: 3 }}
								activeDot={{ r: 5, fill: "#fb8a2e" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>
			</div>
		</div>
	);
}
