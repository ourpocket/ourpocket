import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { CreateTransactionPayload, Transaction } from "@/services/types";

function createTransaction(projectApiKey: string, payload: CreateTransactionPayload) {
	return apiRequest<Transaction>(API_ROUTES.transactions.create, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
	});
}

function getTransaction(projectApiKey: string, transactionId: string) {
	return apiRequest<Transaction>(API_ROUTES.transactions.get(transactionId), {
		apiKey: projectApiKey,
		auth: false,
	});
}

export { createTransaction, getTransaction };
