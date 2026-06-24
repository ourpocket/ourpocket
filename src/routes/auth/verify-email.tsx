import VerifyEmail from "@/pages/auth/verify-email";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify-email")({
	component: RouteComponent,
});

function RouteComponent() {
	return <VerifyEmail />;
}
