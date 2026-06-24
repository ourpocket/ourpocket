import ProjectsPage from "@/pages/dashboard/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ProjectsPage />;
}
