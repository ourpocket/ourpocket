import ResetPassword from "@/pages/auth/reset-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ResetPassword />;
}
