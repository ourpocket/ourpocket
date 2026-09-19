import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { postFinancialResource } from "./financial.service";

const payment = {
	id: "c698f53d-b65c-4c44-b0c7-186c827a9570",
	projectId: "5f27be41-36c2-4fd3-8ab4-69851fe47c4c",
	environment: "sandbox",
	kind: "payment",
	status: "completed",
	amount: "50000",
	currency: "NGN",
	provider: "paystack",
	providerReference: null,
	parentId: "dcab3c1d-409b-4e1b-9ee0-f14966d295d7",
	details: {},
	requestId: "0328d7ad-1968-4634-8f52-c385d829e12a",
	createdAt: "2026-09-19T10:00:00.000Z",
	updatedAt: "2026-09-19T10:00:00.000Z",
};

beforeEach(() => {
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: { getItem: () => null },
	});
});

afterEach(() => vi.unstubAllGlobals());

it("sends a project key and idempotency key for payment creation", async () => {
	const transport = vi
		.fn<typeof fetch>()
		.mockResolvedValue(new Response(JSON.stringify({ data: payment }), { status: 201 }));
	vi.stubGlobal("fetch", transport);

	const result = await postFinancialResource(
		"/payments",
		{ customer: payment.parentId, amount: "50000", currency: "NGN" },
		"op_test_sk_fixture",
		"payment-once",
	);

	expect(result.id).toBe(payment.id);
	expect(transport).toHaveBeenCalledTimes(1);
	const [url, options] = transport.mock.calls[0];
	expect(String(url)).toMatch(/\/v1\/payments$/);
	expect(options?.method).toBe("POST");
	expect(new Headers(options?.headers).get("Authorization")).toBe("Bearer op_test_sk_fixture");
	expect(new Headers(options?.headers).get("Idempotency-Key")).toBe("payment-once");
});

it("reports an uncertain network outcome without retrying the write", async () => {
	const transport = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("connection lost"));
	vi.stubGlobal("fetch", transport);

	await expect(
		postFinancialResource("/payments", { amount: "50000" }, "op_test_sk_fixture", "payment-once"),
	).rejects.toThrow("the operation outcome may be unknown");
	expect(transport).toHaveBeenCalledTimes(1);
});
