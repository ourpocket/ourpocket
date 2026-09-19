# OurPocket

OurPocket is a developer control plane for working with financial providers. Teams can test payment and wallet flows in Sandbox, then connect their own Paystack, Flutterwave, or Mono accounts for supported production operations. OurPocket does not hold funds. Provider account ownership, settlement, and end-customer records stay with the team using the product.

This repository contains the React frontend: the public site, beta access flow, and project dashboard. The API lives in [`ourpocket/infra`](https://github.com/ourpocket/infra); the customer documentation lives in [`ourpocket/doc`](https://github.com/ourpocket/doc). The TypeScript SDK is maintained separately and is not published yet.

## Run locally

Install [Bun](https://bun.sh/) and clone the repository:

```bash
git clone https://github.com/ourpocket/ourpocket.git
cd ourpocket
bun install
```

Create `.env.local` for a local API, then start the frontend:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_API_PUBLIC_URL=http://localhost:3000
VITE_BETA_ACCESS_ONLY=true
```

```bash
bun run dev
```

The app runs at `http://localhost:3035`. Set `VITE_BETA_ACCESS_ONLY=false` only when public registration is intended. Variables beginning with `VITE_` are included in the browser bundle, so never put API keys or provider credentials in them.

## Verify changes

```bash
bunx tsc --noEmit
bun run test
bun run lint
bun run build
bun run serve
```

`bun run serve` previews the production build, including the generated PWA manifest and service worker. The service worker caches static frontend assets; it does not cache API or provider responses.

`bun run check` combines Biome and Oxlint. The repository currently has unrelated Biome formatting findings, so use its output to review the affected files rather than treating a failure as a frontend build failure.

## How the product works

Sandbox uses `op_test_sk_` keys for simulated operations and never calls a financial provider. Production uses `op_live_sk_` keys and requires an active connection to a provider account owned by the customer. The dashboard can request a live provider overview, but provider balances, activity, and customer details are not saved as dashboard snapshots. The caller should retain provider references and results needed for its own reconciliation or support work.

See the [customer documentation](https://github.com/ourpocket/doc) for current operations and the [API repository](https://github.com/ourpocket/infra) for backend behavior and deployment details.
