import WalletsPage from "@/pages/dashboard/wallets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallets")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WalletsPage />;
}
