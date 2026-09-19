import { type FinancialResource, financialResourceSchema } from "@ourpocket/sdk";
import { z } from "zod";
import { apiRequest } from "./api-client";

const logSchema = z.object({
	id: z.uuid(),
	requestId: z.uuid(),
	operation: z.string(),
	source: z.string(),
	details: z.record(z.string(), z.unknown()),
	createdAt: z.string(),
});

export type FinancialLog = z.infer<typeof logSchema>;

export const deliverySchema = z.object({
	id: z.uuid(),
	eventId: z.uuid(),
	requestId: z.uuid(),
	webhookId: z.uuid(),
	status: z.enum(["pending", "completed", "failed"]),
	attempts: z.number(),
	history: z.array(
		z.object({
			attemptedAt: z.string(),
			statusCode: z.number().nullable(),
			latencyMs: z.number(),
			response: z.string(),
		}),
	),
	createdAt: z.string(),
});

export type FinancialDelivery = z.infer<typeof deliverySchema>;

export async function listFinancialResources(
	projectId: string,
	group: "transactions" | "wallets" = "transactions",
): Promise<FinancialResource[]> {
	return z
		.array(financialResourceSchema)
		.parse(await apiRequest<unknown>(`/projects/${projectId}/financial/resources?group=${group}`));
}

export async function listFinancialLogs(projectId: string) {
	return z
		.array(logSchema)
		.parse(await apiRequest<unknown>(`/projects/${projectId}/financial/logs`));
}

export async function listDeliveries(projectId: string) {
	return z
		.array(deliverySchema)
		.parse(await apiRequest<unknown>(`/projects/${projectId}/financial/deliveries`));
}

export function replayDelivery(projectId: string, id: string) {
	return apiRequest(`/projects/${projectId}/financial/deliveries/${id}/replay`, {
		method: "POST",
		body: "{}",
	});
}

export function sendTestEvent(projectId: string) {
	return apiRequest(`/projects/${projectId}/financial/webhooks/test`, {
		method: "POST",
		body: "{}",
	});
}
