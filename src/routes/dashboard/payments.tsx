import PaymentsPage from "@/pages/dashboard/payments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payments")({
	component: PaymentsPage,
});
