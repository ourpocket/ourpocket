# OurPocket 🚀

## Wallet as a Service Abstraction Layer

**One API to rule them all.** Stop building wallet integrations from scratch. OurPocket provides a unified API layer between your applications and multiple third-party wallet/payment providers.

## 🎯 The Problem We Solve

Building wallet functionality means:

- Integrating with multiple payment providers individually
- Managing different API specifications and quirks
- Handling provider downtime and failover logic
- Weeks of development time for basic wallet features
- Maintaining multiple integrations as APIs change

---

## ⚡ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) >= 18
- Git

---

### Setup & Run

```bash
# Clone repository
git clone https://github.com/ourpocket/ourpocket.git

# Navigate to project directory
cd ourpocket

# Install dependencies
bun install

# Start development server
bun run dev

# Format code with Prettier
bun run format

# Run lint checks with Bio
bun run lint           me

# Run Biome type & lint checks
bun run check

# Build for production
bun run build

# Preview production build
bun run serve
```
