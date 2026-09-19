import { describe, expect, it, vi } from "vitest";
import { OurPocket, OurPocketError } from "./index";

const ids = Array.from({ length: 4 }, () => crypto.randomUUID());

const resource = {
	id: ids[0],
	projectId: ids[1],
	environment: "sandbox",
	kind: "payment",
	status: "completed",
	amount: "50000",
	currency: "NGN",
	provider: "paystack",
	providerReference: null,
	parentId: ids[2],
	details: { scenario: "success" },
	requestId: ids[3],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

describe("SDK transport", () => {
	it("preserves minor units, idempotency and request IDs with a configurable URL", async () => {
		const transport = vi
			.fn<typeof fetch>()
			.mockResolvedValue(new Response(JSON.stringify({ data: resource }), { status: 201 }));

		const client = new OurPocket({
			apiKey: "op_test_sk_fixture",
			baseUrl: "http://localhost:3000/v1/",
			fetch: transport,
		});

		const payment = await client.payments.create(
			{ customer: ids[2], amount: "50000", currency: "NGN" },
			{ idempotencyKey: "once", requestId: ids[3] },
		);

		expect(payment.amount).toBe("50000");
		expect(transport).toHaveBeenCalledOnce();

		const [url, init] = transport.mock.calls[0];
		const headers = new Headers(init?.headers);

		expect(url).toBe("http://localhost:3000/v1/payments");
		expect(init?.method).toBe("POST");
		expect(headers.get("Idempotency-Key")).toBe("once");
		expect(headers.get("X-Request-Id")).toBe(ids[3]);
		expect(headers.get("Authorization")).toBe("Bearer op_test_sk_fixture");
	});
	it("normalizes network uncertainty and does not retry a financial write", async () => {
		const transport = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("fetch failed"));
		const client = new OurPocket({ apiKey: "op_test_sk_fixture", fetch: transport });
		await expect(
			client.payments.create(
				{ customer: ids[2], amount: "1", currency: "NGN" },
				{ idempotencyKey: "uncertain" },
			),
		).rejects.toMatchObject({ name: "OurPocketError", status: 0 });
		expect(transport).toHaveBeenCalledOnce();
	});
	it("normalizes conflicts and malformed responses without exposing request secrets", async () => {
		const transport = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ message: "Idempotency conflict" }), {
					status: 409,
					headers: { "X-Request-Id": ids[3] },
				}),
			)
			.mockResolvedValueOnce(new Response("<html>error</html>"));

		const client = new OurPocket({ apiKey: "op_test_sk_fixture", fetch: transport });
		await expect(client.payments.get(ids[0])).rejects.toMatchObject({
			name: "OurPocketError",
			status: 409,
			requestId: ids[3],
		});
		await expect(client.payments.get(ids[0])).rejects.toBeInstanceOf(OurPocketError);
	});
});
