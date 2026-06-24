import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import { useCurrentProject } from "@/hooks/use-current-project";
import { useWebhooks } from "@/hooks/use-webhooks";
import { type WebhookEndpoint, WebhookEvent } from "@/services/types";
import { Copy, Eye, EyeSlash, Trash } from "iconsax-reactjs";
import { ExternalLink } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

interface AddEndpointProps {
	projectId?: string;
	onCreated: (webhook: WebhookEndpoint) => void;
}

const AddEndpoint = ({ projectId, onCreated }: AddEndpointProps) => {
	const { createWebhook } = useWebhooks();
	const [url, setUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!projectId) {
			return;
		}

		setIsSubmitting(true);

		try {
			const webhook = await createWebhook(projectId, {
				url,
				eventTypes: [WebhookEvent.TRANSACTION_SUCCESS, WebhookEvent.TRANSACTION_FAILED],
				isActive: true,
			});
			onCreated(webhook);
			setUrl("");
			toast.success("Webhook endpoint added");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not add webhook";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ModularModals trigger={<Button variant="default">Add Endpoint</Button>}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					value={url}
					onChange={(event) => setUrl(event.target.value)}
					placeholder="https://api.yourapp.com/ourpocket/webhook"
					type="url"
					required
				/>
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save Endpoint"}
				</Button>
			</form>
		</ModularModals>
	);
};

const statusStyles: Record<string, string> = {
	Active: "bg-green-100 text-green-700 border border-green-200",
	Inactive: "bg-red-100 text-red-700 border border-red-200",
};

const StatusBadge = ({ status }: { status: keyof typeof statusStyles }) => (
	<Badge className={`${statusStyles[status]} px-2 py-0.5 rounded-md text-xs`}>{status}</Badge>
);

const tableHeaders = ["Endpoint ID", "Events", "Endpoint", "Status", "Secret", "Created", "Action"];

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

const WebhooksPage = () => {
	const { project, isLoading } = useCurrentProject();
	const { deleteWebhook, listWebhooks } = useWebhooks();
	const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
	const unifiedWebhookUrl = `${import.meta.env.VITE_API_PUBLIC_URL || "http://localhost:3000"}/ourpocket/webhook`;

	useEffect(() => {
		let isMounted = true;

		async function loadWebhooks() {
			if (!project) {
				return;
			}

			try {
				const endpoints = await listWebhooks(project.id);
				if (isMounted) {
					setWebhooks(endpoints);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load webhooks";
				toast.error(message);
			}
		}

		void loadWebhooks();

		return () => {
			isMounted = false;
		};
	}, [project]);

	const handleCreated = (webhook: WebhookEndpoint) => {
		setWebhooks((current) => [webhook, ...current]);
	};

	const handleDelete = async (webhookId: string) => {
		if (!project) {
			return;
		}

		try {
			await deleteWebhook(project.id, webhookId);
			setWebhooks((current) => current.filter((webhook) => webhook.id !== webhookId));
			toast.success("Webhook endpoint deleted");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not delete webhook";
			toast.error(message);
		}
	};

	return (
		<DashboardLayout>
			<div className="flex flex-col gap-6">
				<WebhookUrlCard url={unifiedWebhookUrl} />

				<div className="rounded-xl border bg-card p-6 shadow-md text-white">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-lg font-semibold mb-2">Webhook Endpoints</h3>
							<p className="text-sm text-gray-300 mb-6">
								Configure where OurPocket sends normalized project events
							</p>
						</div>

						<AddEndpoint projectId={project?.id} onCreated={handleCreated} />
					</div>

					{isLoading && <p className="mb-4 text-sm text-gray-500">Loading webhooks...</p>}

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
							{webhooks.map((webhook) => (
								<TableRow key={webhook.id} className="hover:bg-gray-800 transition-colors">
									<TableCell className="font-mono py-3 px-4">{webhook.id}</TableCell>
									<TableCell className="py-3 px-4">
										{(webhook.eventTypes ?? []).map((event) => (
											<Badge key={event} className="text-xs mr-1">
												{event}
											</Badge>
										))}
									</TableCell>
									<TableCell className="truncate max-w-[280px] py-3 px-4">{webhook.url}</TableCell>
									<TableCell className="py-3 px-4">
										<StatusBadge status={webhook.isActive ? "Active" : "Inactive"} />
									</TableCell>
									<TableCell className="py-3 px-4 font-mono">
										{`${webhook.secret.slice(0, 10)}********`}
									</TableCell>
									<TableCell className="flex items-center gap-2 py-3 px-4 text-sm text-gray-300">
										{moment(webhook.createdAt).format("MMM D, YYYY • h:mm A")}
										<span className="text-xs text-gray-500">
											({moment(webhook.createdAt).fromNow()})
										</span>
										<ExternalLink
											size={14}
											className="cursor-pointer text-gray-400 hover:text-white"
										/>
									</TableCell>
									<TableCell className="py-3 px-4">
										<Button className="bg-gray-700/20" onClick={() => handleDelete(webhook.id)}>
											<Trash variant="Bulk" size={16} />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default WebhooksPage;
