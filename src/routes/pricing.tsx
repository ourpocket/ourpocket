import PricingPage from "@/pages/pricing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
	component: PricingPage,
});
