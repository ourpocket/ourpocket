import WelcomeAlert from "@/pages/onboarding/welcome-alert";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/welcome")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WelcomeAlert />;
}
