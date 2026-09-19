import { z } from "zod";

export const resourceSchema = z.object({
	id: z.uuid(),
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
	kind: z.enum(["customer", "payment", "refund", "wallet", "transfer"]),
	status: z.enum(["pending", "completed", "failed"]),
	amount: z.string().nullable(),
	currency: z.string().nullable(),
	provider: z.enum(["paystack", "flutterwave"]).nullable(),
	providerReference: z.string().nullable(),
	parentId: z.string().nullable(),
	details: z.record(z.string(), z.unknown()),
	requestId: z.uuid(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const customerSchema = resourceSchema.extend({
	kind: z.literal("customer"),
	details: z.object({ email: z.email(), name: z.string().optional() }),
});

export const paymentSchema = resourceSchema.extend({
	kind: z.literal("payment"),
	details: z.object({
		checkoutUrl: z.url().optional(),
		checkoutReference: z.string().optional(),
		callbackUrl: z.url().optional(),
		scenario: z.string().optional(),
		providerOutcome: z.enum(["unknown", "rejected"]).optional(),
	}),
});

export const refundSchema = resourceSchema.extend({ kind: z.literal("refund") });

export const walletSchema = resourceSchema.extend({
	kind: z.literal("wallet"),
	details: z.object({ balance: z.string() }),
});

export const transferSchema = resourceSchema.extend({ kind: z.literal("transfer") });

export const financialResourceSchema = z.discriminatedUnion("kind", [
	customerSchema,
	paymentSchema,
	refundSchema,
	walletSchema,
	transferSchema,
]);

export type FinancialResource = z.infer<typeof financialResourceSchema>;

export const transactionSchema = z.discriminatedUnion("kind", [
	paymentSchema,
	refundSchema,
	transferSchema,
]);

export type Transaction = z.infer<typeof transactionSchema>;

export const integrationSchema = z.object({
	id: z.uuid(),
	provider: z.string(),
	providerId: z.uuid().nullable(),
	environment: z.enum(["sandbox", "production"]),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Integration = z.infer<typeof integrationSchema>;

export type Customer = z.infer<typeof customerSchema>;

export type Payment = z.infer<typeof paymentSchema>;

export type Refund = z.infer<typeof refundSchema>;

export type Wallet = z.infer<typeof walletSchema>;

export type Transfer = z.infer<typeof transferSchema>;

export type Provider = "paystack" | "flutterwave";

export type Environment = "sandbox" | "production";

export type Scenario =
	| "success"
	| "failure"
	| "pending"
	| "insufficient_funds"
	| "timeout"
	| "provider_outage";

export interface AmountInput {
	amount: string;
	currency: string;
	scenario?: Scenario;
}

export interface PaymentInput extends AmountInput {
	customer: string;
	provider?: Provider;
	callbackUrl?: string;
}

export interface RefundInput {
	payment: string;
	amount?: string;
	scenario?: Scenario;
}

export interface WalletInput {
	currency: string;
	customer?: string;
}

export interface TransferInput extends AmountInput {
	fromWallet: string;
	toWallet: string;
}

export interface CustomerInput {
	email: string;
	name?: string;
}

export interface RequestOptions {
	requestId?: string;
}

export interface WriteOptions extends RequestOptions {
	idempotencyKey: string;
}

export interface ClientOptions {
	apiKey: string;
	baseUrl?: string;
	fetch?: typeof fetch;
}

type RequestBody =
	| CustomerInput
	| PaymentInput
	| RefundInput
	| WalletInput
	| TransferInput
	| AmountInput
	| { status: "completed" | "failed" };

interface InternalRequestOptions extends RequestOptions {
	idempotencyKey?: string;
}

export const eventSchema = z.object({
	id: z.uuid(),
	projectId: z.uuid(),
	environment: z.enum(["sandbox", "production"]),
	type: z.string(),
	resourceId: z.uuid(),
	requestId: z.uuid(),
	data: z.record(z.string(), z.unknown()),
	createdAt: z.string(),
});

export type Event = z.infer<typeof eventSchema>;

export const providerSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	status: z.enum(["active", "coming_soon", "maintenance", "retired"]),
	capabilities: z.object({
		payments: z.boolean(),
		refunds: z.boolean(),
		wallets: z.boolean(),
		transfers: z.boolean(),
	}),
});

export class OurPocketError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly requestId: string,
	) {
		super(message);
		this.name = "OurPocketError";
	}
}

export class OurPocket {
	private readonly transport: typeof fetch;
	private readonly baseUrl: string;
	private readonly apiKey: string;
	constructor(options: ClientOptions) {
		if (!options.apiKey.startsWith("op_test_sk_") && !options.apiKey.startsWith("op_live_sk_"))
			throw new Error("A project API key is required");
		this.apiKey = options.apiKey;
		this.transport = options.fetch ?? fetch;
		this.baseUrl = (options.baseUrl ?? "https://nass-api.up.railway.app/v1").replace(/\/$/, "");
	}
	private async request<T>(
		path: string,
		schema: z.ZodType<T>,
		options: InternalRequestOptions = {},
		body?: RequestBody,
		method = "GET",
	): Promise<T> {
		const requestId = options.requestId ?? crypto.randomUUID();

		const headers = new Headers({
			Authorization: `Bearer ${this.apiKey}`,
			"X-Request-Id": requestId,
		});

		if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);

		if (body !== undefined) headers.set("Content-Type", "application/json");
		// Financial writes are sent once. Unknown outcomes must be verified before initiating another operation.
		let response: Response;

		try {
			response = await this.transport(`${this.baseUrl}${path}`, {
				method,
				headers,
				body: body === undefined ? undefined : JSON.stringify(body),
			});
		} catch {
			throw new OurPocketError(
				"Connection failed; the operation outcome may be unknown. Reuse its idempotency key or inspect the operation.",
				0,
				requestId,
			);
		}

		const payload: unknown = await response.json().catch(() => null);

		const error = z
			.object({ message: z.union([z.string(), z.array(z.string())]).optional() })
			.safeParse(payload);

		if (!response.ok)
			throw new OurPocketError(
				error.success ? String(error.data.message ?? "Request failed") : "Request failed",
				response.status,
				response.headers.get("x-request-id") ?? requestId,
			);
		const envelope = z.object({ data: z.unknown() }).safeParse(payload);
		const result = schema.safeParse(envelope.success ? envelope.data.data : payload);

		if (!result.success)
			throw new OurPocketError(
				"Invalid API response",
				response.status,
				response.headers.get("x-request-id") ?? requestId,
			);

		return result.data;
	}
	readonly context = {
		get: (options?: RequestOptions) =>
			this.request(
				"/financial-context",
				z.object({ projectId: z.uuid(), environment: z.enum(["sandbox", "production"]) }),
				options,
			),
	};
	readonly customers = {
		create: (input: CustomerInput, options: WriteOptions) =>
			this.request("/customers", customerSchema, options, input, "POST"),
		get: (id: string, options?: RequestOptions) =>
			this.request(`/customers/${encodeURIComponent(id)}`, customerSchema, options),
		list: (options?: RequestOptions) =>
			this.request("/customers", z.array(customerSchema), options),
	};
	readonly payments = {
		create: (input: PaymentInput, options: WriteOptions) =>
			this.request("/payments", paymentSchema, options, input, "POST"),
		get: (id: string, options?: RequestOptions) =>
			this.request(`/payments/${encodeURIComponent(id)}`, paymentSchema, options),
		verify: (id: string, options?: RequestOptions) =>
			this.request(
				`/payments/${encodeURIComponent(id)}/verify`,
				paymentSchema,
				options,
				undefined,
				"POST",
			),
		list: (options?: RequestOptions) => this.request("/payments", z.array(paymentSchema), options),
	};
	readonly refunds = {
		create: (input: RefundInput, options: WriteOptions) =>
			this.request("/refunds", refundSchema, options, input, "POST"),
		get: (id: string, options?: RequestOptions) =>
			this.request(`/refunds/${encodeURIComponent(id)}`, refundSchema, options),
		verify: (id: string, options?: RequestOptions) =>
			this.request(
				`/refunds/${encodeURIComponent(id)}/verify`,
				refundSchema,
				options,
				undefined,
				"POST",
			),
		list: (options?: RequestOptions) => this.request("/refunds", z.array(refundSchema), options),
	};
	readonly wallets = {
		create: (input: WalletInput, options: WriteOptions) =>
			this.request("/sandbox/wallets", walletSchema, options, input, "POST"),
		get: (id: string, options?: RequestOptions) =>
			this.request(`/sandbox/wallets/${encodeURIComponent(id)}`, walletSchema, options),
		list: (options?: RequestOptions) =>
			this.request("/sandbox/wallets", z.array(walletSchema), options),
		fund: (id: string, input: AmountInput, options: WriteOptions) =>
			this.request(
				`/sandbox/wallets/${encodeURIComponent(id)}/fund`,
				transferSchema,
				options,
				input,
				"POST",
			),
		debit: (id: string, input: AmountInput, options: WriteOptions) =>
			this.request(
				`/sandbox/wallets/${encodeURIComponent(id)}/debit`,
				transferSchema,
				options,
				input,
				"POST",
			),
	};
	readonly transfers = {
		create: (input: TransferInput, options: WriteOptions) =>
			this.request("/sandbox/transfers", transferSchema, options, input, "POST"),
	};
	readonly sandbox = {
		complete: (id: string, status: "completed" | "failed", options?: RequestOptions) =>
			this.request(
				`/sandbox/operations/${encodeURIComponent(id)}/complete`,
				financialResourceSchema,
				options,
				{ status },
				"POST",
			),
	};
	readonly events = {
		list: (options?: RequestOptions) => this.request("/events", z.array(eventSchema), options),
	};
	readonly transactions = {
		list: (options?: RequestOptions) =>
			this.request("/financial-transactions", z.array(transactionSchema), options),
	};
	readonly integrations = {
		list: (options?: RequestOptions) =>
			this.request("/integrations", z.array(integrationSchema), options),
	};
	readonly providers = {
		list: (options?: RequestOptions) =>
			this.request("/providers", z.array(providerSchema), options),
		get: async (name: Provider, options?: RequestOptions) => {
			const providers = await this.request("/providers", z.array(providerSchema), options);
			const provider = providers.find((item) => item.name === name);

			if (!provider) throw new Error("Provider unavailable");

			return provider;
		},
	};
}

export default OurPocket;
