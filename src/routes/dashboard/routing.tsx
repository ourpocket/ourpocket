import RoutingPage from "@/pages/dashboard/routing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/routing")({
	component: RoutingPage,
});
