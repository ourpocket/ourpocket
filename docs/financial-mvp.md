# Financial infrastructure MVP

The dashboard keeps its current visual system and adds an environment selector, capability/status labels for providers, environment-scoped dashboard metrics, Payments/Refunds transaction views, simulated fiat Wallet operations, webhook event filters/delivery inspection/test/replay, API Logs, and one-time sandbox/API-key secret handling. The selector defaults to Sandbox per project; every dashboard request includes `X-Environment`, and switching project or environment clears sensitive input and reloads the view.

`packages/sdk` is the private source package `@ourpocket/sdk`. It validates normalized API responses and types customers, providers, integrations, payments, refunds, transactions, sandbox wallets/transfers, and events. It supports base URL and request ID configuration and requires caller-supplied idempotency keys. It sends each financial write once. See [`packages/sdk/README.md`](../packages/sdk/README.md) for the runnable sandbox and signed webhook receiver quickstart. Do not publish this package for the MVP.

Production provider connections are customer-owned and environment-specific. Paystack and Flutterwave expose Payments and Refunds. Other catalog entries show an unavailable state. Production wallet actions display an explicit unavailable message; fake funding and simulation controls appear only in Sandbox.

Roll out the migrated backend and Redis webhook worker before this frontend. The backend PR runbook documents `PROVIDER_CONFIG_ENCRYPTION_KEY`, worker variables, migration order, legacy-record quarantine, webhook verification and full acceptance commands. No manual Vercel deployment is part of this change.

Validation includes Vitest, TypeScript, the SDK tests/quickstart against a disposable local backend, a production Vite build, scoped anti-slop lint for the added financial UI/services, and browser checks at 390 px, 768 px, and 1440 px. The existing source-wide anti-slop baseline has 169 findings in files outside the new financial UI; they are reported separately from this change.
