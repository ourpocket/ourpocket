import TransactionsPage from "@/pages/dashboard/transactions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/transactions")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TransactionsPage />;
}
