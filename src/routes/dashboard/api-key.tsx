import ApiKeysPage from "@/pages/dashboard/api-keys.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/api-key")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ApiKeysPage />;
}
