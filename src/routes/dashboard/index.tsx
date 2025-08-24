import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<Card>lorem</Card>
		</DashboardLayout>
	);
}
