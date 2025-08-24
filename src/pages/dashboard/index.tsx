"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, DollarCircle, UserOctagon, Wallet } from "iconsax-reactjs";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const transactionVolumeData = [
	{ month: "Jan", value: 12000000 },
	{ month: "Feb", value: 9500000 },
	{ month: "Mar", value: 7000000 },
	{ month: "Apr", value: 8500000 },
	{ month: "May", value: 6500000 },
	{ month: "Jun", value: 7500000 },
	{ month: "Jul", value: 10000000 },
	{ month: "Aug", value: 13000000 },
];

const apiUsageData = [
	{ day: "Mon", requests: 13000 },
	{ day: "Tue", requests: 19000 },
	{ day: "Wed", requests: 15000 },
	{ day: "Thu", requests: 25000 },
	{ day: "Fri", requests: 22000 },
	{ day: "Sat", requests: 18000 },
	{ day: "Sun", requests: 14000 },
];

const StatCard = ({ title, value, trend, trendValue, trendText, Icon }) => {
	const isPositiveTrend = trendValue.includes("+");
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

const ChartCard = ({ title, subtitle, children }) => (
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

export default function DashboardOverview() {
	const stats = [
		{
			title: "Total Transaction",
			value: "₦2.5M",
			trendValue: "+12.5%",
			trendText: "from last month",
			Icon: DollarCircle,
		},
		{
			title: "API Requests",
			value: "1.5K",
			trendValue: "+8.2%",
			trendText: "from last month",
			Icon: Activity,
		},
		{
			title: "Active Wallets",
			value: "150",
			trendValue: "+23.1%",
			trendText: "from last month",
			Icon: Wallet,
		},
		{
			title: "Success Rate",
			value: "67.1%",
			trendValue: "-0.3%",
			trendText: "from last month",
			Icon: UserOctagon,
		},
	];

	return (
		<div className="p-6 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => (
						<StatCard key={index} {...stat} />
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ChartCard title="Transaction Volume" subtitle="Monthly transaction volume and count">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={transactionVolumeData}
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
							<LineChart data={apiUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
									stroke="#059669"
									strokeWidth={3}
									dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, fill: "#059669" }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</ChartCard>
				</div>
			</div>
		</div>
	);
}
