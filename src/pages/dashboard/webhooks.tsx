import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import { Code1, Copy, Eye, EyeSlash } from "iconsax-reactjs";
import { ExternalLink } from "lucide-react";
import moment from "moment";
import { useState } from "react";

const AddEndpoint = () => (
	<ModularModals trigger={<Button variant="default">Add Endpoint</Button>} />
);

const statusStyles: Record<string, string> = {
	Success: "bg-green-100 text-green-700 border border-green-200",
	Failed: "bg-red-100 text-red-700 border border-red-200",
	Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

const StatusBadge = ({ status }: { status: keyof typeof statusStyles }) => (
	<Badge className={`${statusStyles[status]} px-2 py-0.5 rounded-md text-xs`}>{status}</Badge>
);

const webhookEvents = [
	{
		id: "wh_001",
		type: "transaction.completed",
		endpoint: "https://api.yourapp.com/webhooks/transactions",
		status: "Success",
		response: "200 OK",
		timestamp: "2024-08-13 14:30:15",
	},
	{
		id: "wh_002",
		type: "wallet.funded",
		endpoint: "https://api.yourapp.com/webhooks/wallets",
		status: "Failed",
		response: "500 Internal Server Error",
		timestamp: "2024-08-13 14:25:03",
	},
	{
		id: "wh_003",
		type: "transaction.failed",
		endpoint: "https://api.yourapp.com/webhooks/transactions",
		status: "Pending",
		response: "Retrying...",
		timestamp: "2024-08-13 14:20:45",
	},
];

const tableHeaders = ["Event ID", "Event Type", "Endpoint", "Status", "Response", "Timestamp"];

// 🔑 Webhook URL card
const WebhookUrlCard = ({ url }: { url: string }) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<ModularCard title="Webhook Endpoint" content={true} className="w-full">
			<div className="flex items-center justify-between">
				<div className="bg-gray-700/20 p-2 rounded-md max-w-[400px] truncate">
					<p className="text-sm">{isVisible ? url : url.replace(/https?:\/\//, "••••••••/")}</p>
				</div>
				<div className="flex gap-2">
					<Copy
						variant="Bulk"
						size={20}
						className="cursor-pointer"
						onClick={() => navigator.clipboard.writeText(url)}
					/>
					{isVisible ? (
						<EyeSlash
							variant="Bulk"
							size={20}
							className="cursor-pointer"
							onClick={() => setIsVisible(false)}
						/>
					) : (
						<Eye
							variant="Bulk"
							size={20}
							className="cursor-pointer"
							onClick={() => setIsVisible(true)}
						/>
					)}
				</div>
			</div>
		</ModularCard>
	);
};

const WebhooksPage = () => (
	<DashboardLayout>
		<div className="flex flex-col gap-6">
			{/* Webhook URL card */}
			<WebhookUrlCard url="https://api.yourapp.com/webhooks/transactions" />

			{/* Recent webhook events */}
			<div className="rounded-xl border bg-card p-6 shadow-md text-white">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Recent Webhook Events</h3>
						<p className="text-sm text-gray-300 mb-6">Real-time webhook delivery logs and status</p>
					</div>

					<Button className="bg-gray-700/20">
						Add Event <Code1 variant="Bulk" />
					</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="border-b border-gray-700">
							{tableHeaders.map((head) => (
								<TableHead key={head} className="text-gray-200 py-3 px-4">
									{head}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{webhookEvents.map((event) => (
							<TableRow key={event.id} className="hover:bg-gray-800 transition-colors">
								<TableCell className="font-mono py-3 px-4">{event.id}</TableCell>
								<TableCell className="py-3 px-4">
									<Badge className="text-xs">{event.type}</Badge>
								</TableCell>
								<TableCell className="truncate max-w-[280px] py-3 px-4">{event.endpoint}</TableCell>
								<TableCell className="py-3 px-4">
									<StatusBadge status={event.status as keyof typeof statusStyles} />
								</TableCell>
								<TableCell className="py-3 px-4">{event.response}</TableCell>
								<TableCell className="flex items-center gap-2 py-3 px-4 text-sm text-gray-300">
									{moment(event.timestamp).format("MMM D, YYYY • h:mm A")}
									<span className="text-xs text-gray-500">
										({moment(event.timestamp).fromNow()})
									</span>
									<ExternalLink
										size={14}
										className="cursor-pointer text-gray-400 hover:text-white"
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	</DashboardLayout>
);

export default WebhooksPage;
