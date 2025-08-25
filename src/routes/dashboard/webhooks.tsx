import WebhooksPage from "@/pages/dashboard/webhooks.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/webhooks")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WebhooksPage />;
}
