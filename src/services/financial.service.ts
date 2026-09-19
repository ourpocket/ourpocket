import { z } from "zod";
import { ApiTransportError, apiRequest } from "./api-client";

const resourceSchema = z.object({
	id: z.uuid(),
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
	status: z.enum(["pending", "unknown", "completed", "failed"]),
	amount: z.string().nullable(),
	currency: z.string().nullable(),
	provider: z.enum(["paystack", "flutterwave", "mono", "turnkey", "privy"]).nullable(),
	providerReference: z.string().nullable(),
	parentId: z.string().nullable(),
	requestId: z.uuid(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const financialResourceSchema = z.discriminatedUnion("kind", [
	resourceSchema.extend({
		kind: z.literal("customer"),
		details: z.object({ email: z.email(), name: z.string().optional() }),
	}),
	resourceSchema.extend({
		kind: z.literal("payment"),
		details: z.object({ checkoutUrl: z.url().optional() }).catchall(z.unknown()),
	}),
	resourceSchema.extend({
		kind: z.literal("refund"),
		details: z.record(z.string(), z.unknown()),
	}),
	resourceSchema.extend({
		kind: z.literal("wallet"),
		details: z.object({ balance: z.string().nullable() }).catchall(z.unknown()),
	}),
	resourceSchema.extend({
		kind: z.literal("transfer"),
		details: z.record(z.string(), z.unknown()),
	}),
]);

export type FinancialResource = z.infer<typeof financialResourceSchema>;

const financialContextSchema = z.object({
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
});

export async function getFinancialContext(apiKey: string) {
	return financialContextSchema.parse(
		await apiRequest<unknown>("/financial-context", { auth: false, apiKey }),
	);
}

export async function postFinancialResource(
	path: string,
	body: Record<string, unknown> | undefined,
	apiKey: string,
	idempotencyKey?: string,
): Promise<FinancialResource> {
	let response: unknown;

	try {
		response = await apiRequest<unknown>(path, {
			method: "POST",
			auth: false,
			apiKey,
			headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch (error) {
		if (error instanceof ApiTransportError) {
			throw new Error(
				"Connection failed; the operation outcome may be unknown. Reuse its idempotency key or inspect the operation.",
				{ cause: error },
			);
		}
		throw error;
	}

	return financialResourceSchema.parse(response);
}

const transientCheckoutSchema = z.object({
	provider: z.enum(["paystack", "flutterwave", "mono"]),
	reference: z.string(),
	checkoutUrl: z.url(),
});

export type TransientCheckout = z.infer<typeof transientCheckoutSchema>;

export async function postTransientCheckout(
	body: Record<string, unknown>,
	apiKey: string,
): Promise<TransientCheckout> {
	return transientCheckoutSchema.parse(
		await apiRequest<unknown>("/payments", {
			method: "POST",
			auth: false,
			apiKey,
			body: JSON.stringify(body),
		}),
	);
}

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
	status: z.enum(["pending", "processing", "completed", "failed"]),
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

const providerActivityItemSchema = z.object({
	id: z.string(),
	reference: z.string().nullable(),
	status: z.string(),
	amount: z.string().nullable(),
	currency: z.string().nullable(),
	occurredAt: z.string().nullable(),
	channel: z.string().nullable().optional(),
});

const providerOverviewSectionSchema = <T extends z.ZodType>(schema: T) =>
	z.object({
		state: z.enum(["available", "unavailable"]),
		data: schema.nullable(),
		message: z.string().optional(),
	});

export const providerOverviewSchema = z.object({
	provider: z.enum(["paystack", "flutterwave", "mono"]),
	fetchedAt: z.string(),
	source: z.literal("live"),
	capabilities: z.array(z.string()),
	balances: providerOverviewSectionSchema(
		z.array(
			z.object({
				currency: z.string(),
				available: z.string().nullable(),
				ledger: z.string().nullable(),
			}),
		),
	),
	totals: providerOverviewSectionSchema(
		z.object({
			transactionCount: z.number().nullable(),
			volumeByCurrency: z.array(z.object({ currency: z.string(), amount: z.string() })),
			pendingPayouts: z.number().nullable(),
		}),
	),
	payments: providerOverviewSectionSchema(z.array(providerActivityItemSchema)),
	payouts: providerOverviewSectionSchema(z.array(providerActivityItemSchema)),
	virtualAccounts: providerOverviewSectionSchema(
		z.array(
			z.object({
				id: z.string(),
				bankName: z.string().nullable(),
				accountNumber: z.string().nullable(),
				maskedAccountNumber: z.string().nullable(),
				status: z.string(),
				createdAt: z.string().nullable(),
			}),
		),
	),
});

export type ProviderOverview = z.infer<typeof providerOverviewSchema>;

const routingPolicySchema = z.object({
	id: z.uuid().nullable(),
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
	strategy: z.enum(["best_success_rate", "lowest_fees", "fastest_response", "custom_priority"]),
	providerPriority: z.array(z.enum(["paystack", "flutterwave"])),
	requireHealthy: z.boolean(),
	safeFailover: z.boolean(),
});

const providerHealthSchema = z.object({
	provider: z.enum(["paystack", "flutterwave"]),
	connected: z.boolean(),
	status: z.enum(["unknown", "healthy", "degraded", "down"]),
	successRate: z.string().nullable(),
	settledCount: z.number(),
	p95LatencyMs: z.number().nullable(),
	latencyCount: z.number(),
	estimatedFeeBps: z.number().nullable(),
	updatedAt: z.string().nullable(),
});

const reconciliationRunSchema = z.object({
	id: z.uuid(),
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
	status: z.enum(["running", "completed", "failed"]),
	inspected: z.number(),
	resolved: z.number(),
	unresolved: z.number(),
	resourceIds: z.array(z.uuid()),
	requestId: z.uuid(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type RoutingPolicy = z.infer<typeof routingPolicySchema>;
export type ProviderHealth = z.infer<typeof providerHealthSchema>;
export type ReconciliationRun = z.infer<typeof reconciliationRunSchema>;

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

export async function getRoutingPolicy(projectId: string) {
	return routingPolicySchema.parse(
		await apiRequest<unknown>(`/projects/${projectId}/financial/routing-policy`),
	);
}

export async function saveRoutingPolicy(
	projectId: string,
	policy: Pick<RoutingPolicy, "strategy" | "providerPriority" | "requireHealthy" | "safeFailover">,
) {
	return routingPolicySchema.parse(
		await apiRequest<unknown>(`/projects/${projectId}/financial/routing-policy`, {
			method: "POST",
			body: JSON.stringify(policy),
		}),
	);
}

export async function listProviderHealth(projectId: string) {
	return z
		.array(providerHealthSchema)
		.parse(await apiRequest<unknown>(`/projects/${projectId}/financial/provider-health`));
}

export async function saveProviderHealth(
	projectId: string,
	provider: ProviderHealth["provider"],
	input: Pick<ProviderHealth, "status" | "estimatedFeeBps">,
) {
	return apiRequest<unknown>(`/projects/${projectId}/financial/provider-health/${provider}`, {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function listReconciliationRuns(projectId: string) {
	return z
		.array(reconciliationRunSchema)
		.parse(await apiRequest<unknown>(`/projects/${projectId}/financial/reconciliation`));
}

export async function runReconciliation(projectId: string) {
	return reconciliationRunSchema.parse(
		await apiRequest<unknown>(`/projects/${projectId}/financial/reconciliation`, {
			method: "POST",
			body: "{}",
		}),
	);
}
