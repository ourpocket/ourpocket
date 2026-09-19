import DashboardLayout from "@/components/layouts/dashboard-layout";
import FinancialOperations from "@/components/module/financial/operations";
import { useEnvironment, useSelectedProjectId } from "@/lib/environment";

export default function PaymentsPage() {
	const environment = useEnvironment();
	const projectId = useSelectedProjectId();

	return (
		<DashboardLayout
			title="Payments"
			description="Create checkouts, simulate outcomes, verify settlements, and issue refunds."
		>
			<FinancialOperations key={`${projectId}:${environment}`} />
		</DashboardLayout>
	);
}
