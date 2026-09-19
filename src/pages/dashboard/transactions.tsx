import DashboardLayout from "@/components/layouts/dashboard-layout";
import FinancialOperations from "@/components/module/financial/operations";
import { useEnvironment, useSelectedProjectId } from "@/lib/environment";

export default function TransactionsPage() {
	const environment = useEnvironment();
	const projectId = useSelectedProjectId();

	return (
		<DashboardLayout
			title="Transactions"
			description="Inspect payments and refunds across your financial infrastructure."
		>
			<FinancialOperations key={`${projectId}:${environment}`} />
		</DashboardLayout>
	);
}
