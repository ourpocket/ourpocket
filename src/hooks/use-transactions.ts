import { useServiceAction } from "@/hooks/use-service-action";
import * as transactionService from "@/services/transaction.service";
import type { CreateTransactionPayload } from "@/services/types";

function useTransactions() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		createTransaction: (projectApiKey: string, payload: CreateTransactionPayload) =>
			run(() => transactionService.createTransaction(projectApiKey, payload)),
		getTransaction: (projectApiKey: string, transactionId: string) =>
			run(() => transactionService.getTransaction(projectApiKey, transactionId)),
	};
}

export { useTransactions };
