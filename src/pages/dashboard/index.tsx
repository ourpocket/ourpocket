"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type UsageMetrics, getUsageMetrics } from "@/lib/api";
import { useCurrentProject } from "@/lib/hooks/use-current-project";
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
		<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none bg-card ">
			<CardContent className="p-6 py-2">
				<div className="flex items-center gap-3 mb-4">
					<Icon size={24} className="text-white" variant="Bulk" />
					<p className="text-sm text-gray-500 font-medium">{title}</p>
				</div>
				<div className="space-y-2">
					<p className="text-2xl font-bold text-white">{value}</p>
				</div>
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
	<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none ">
		<CardHeader className="pb-4">
			<div>
				<h3 className="text-lg font-semibold text-white ">{title}</h3>
				<p className="text-sm text-gray-500">{subtitle}</p>
			</div>
		</CardHeader>
		<CardContent>
			<div className="h-80">{children}</div>
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
	const [metrics, setMetrics] = useState<UsageMetrics>(emptyMetrics);

	useEffect(() => {
		let isMounted = true;

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

	return (
		<div className="p-6 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat) => (
						<StatCard key={stat.title} {...stat} />
					))}
				</div>

				{isLoading && <p className="mb-4 text-sm text-gray-500">Loading dashboard...</p>}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
								<Bar dataKey="value" fill="#EA580C" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</ChartCard>

					<ChartCard title="API Usage" subtitle="Daily API requests over the past week">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={metrics.apiUsage}
								margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							>
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
									stroke="orange"
									strokeWidth={3}
									dot={{ fill: "orange", strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, fill: "orange" }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</ChartCard>
				</div>
			</div>
		</div>
	);
}
