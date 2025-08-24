import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import WalletProvidersPage from "@/pages/dashboard/providers.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallet-providers")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<WalletProvidersPage />
		</DashboardLayout>
	);
}
