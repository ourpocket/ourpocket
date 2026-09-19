# @ourpocket/sdk (source MVP)

Private TypeScript source package. It is not published. Import `OurPocket` from `packages/sdk/src/index.ts`, or map `@ourpocket/sdk` to this package in your workspace. Bun can run the examples directly from the frontend repository.

All monetary amounts are positive integer minor-unit **strings**. For NGN, `"50000"` is ₦500. Keys determine project and environment. Keep secret keys on your server; the dashboard console holds pasted keys only in memory. No financial write is retried automatically. Reuse the same idempotency key and payload after uncertainty; inspect or verify the returned operation. Changing a payload with the same key returns 409.

```ts
import { OurPocket } from "./packages/sdk/src/index";
const pocket = new OurPocket({
  apiKey: process.env.OURPOCKET_API_KEY!,
  baseUrl: "http://localhost:3000/v1",
});
const customer = await pocket.customers.create(
  { email: "sandbox@example.test" },
  { idempotencyKey: "customer-1" },
);
const payment = await pocket.payments.create(
  { customer: customer.id, amount: "50000", currency: "NGN" },
  { idempotencyKey: "payment-1" },
);
```

`customers`, `providers`, `payments`, `refunds`, `wallets`, `transfers`, `sandbox`, `transactions`, and `events` have typed methods and validated responses. `context.get()` identifies the authenticated project and environment. Pass `requestId` (UUID) on any method and `idempotencyKey` on creation/funding/debit/transfer calls. `OurPocketError` contains HTTP `status` and `requestId`; status 0 means transport uncertainty. Lists currently return the most recent 100 records.

## Runnable quickstart

1. Run the migrated backend (see the coordinated backend `docs/financial-mvp.md`). Register at `/v1/auth/register`, verify your email, then sign in at `/v1/auth/login`. Copy the dashboard access token.
2. Set `OURPOCKET_DASHBOARD_TOKEN` and `OURPOCKET_BASE_URL=http://localhost:3000/v1`, then run `bun packages/sdk/examples/quickstart.ts`. It creates a project and returns its sandbox key once, then exercises payment, partial refund, funding and atomic transfer and prints balances/events. No provider account is needed. Optionally set an existing `OURPOCKET_API_KEY` instead of creating another project.
3. To receive webhooks, expose `webhook-receiver.ts` through a public HTTPS development ingress. Set `OURPOCKET_WEBHOOK_URL` before the quickstart to register the endpoint. Save the one-time secret and run `OURPOCKET_WEBHOOK_SECRET=whsec_... bun packages/sdk/examples/webhook-receiver.ts`. Replay the first event in Webhooks after starting the receiver. The backend worker needs Redis and `FINANCIAL_WEBHOOK_WORKER=true`. Local/private URLs and redirects are blocked.
4. The receiver validates the timestamp and HMAC against the **raw body**. Retries/replay have the same event ID and a new delivery ID; persist event IDs in production to prevent duplicate business effects.
5. Select Production in the dashboard, connect your own Paystack or Flutterwave credentials, generate an `op_live_sk_` key, and create a separate server-side client. Production wallets/fake funding and scenarios are rejected. Flutterwave checkout requires an HTTPS `callbackUrl`. Initial checkout is pending; use `payments.verify(id)` after checkout. This quickstart deliberately executes only sandbox operations.

Run `bunx tsc --noEmit -p packages/sdk/tsconfig.json` and `bunx vitest run packages/sdk/src/index.test.ts` from the frontend root.
