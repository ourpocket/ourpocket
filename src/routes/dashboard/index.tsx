import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardOverview from "@/pages/dashboard";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<DashboardOverview />
		</DashboardLayout>
	);
}
