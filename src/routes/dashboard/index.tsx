import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardOverview from "@/pages/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout
			title="Overview"
			description="Monitor activity across the selected project and environment."
		>
			<DashboardOverview />
		</DashboardLayout>
	);
}
