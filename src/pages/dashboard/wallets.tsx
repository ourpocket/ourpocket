import DashboardLayout from "@/components/layouts/dashboard-layout";
import FinancialOperations from "@/components/module/financial/operations";
import { useEnvironment, useSelectedProjectId } from "@/lib/environment";

export default function WalletsPage() {
	const environment = useEnvironment();
	const projectId = useSelectedProjectId();

	return (
		<DashboardLayout
			title="Wallets"
			description="Simulate fiat balances in Sandbox or create provider-backed chain wallets in Production."
		>
			<FinancialOperations key={`${projectId}:${environment}`} wallets />
		</DashboardLayout>
	);
}
