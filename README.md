# OurPocket 🚀
## Wallet as a Service Abstraction Layer

**One API to rule them all.** Stop building wallet integrations from scratch. OurPocket provides a unified API layer between your applications and multiple third-party wallet/payment providers.

## 🎯 The Problem We Solve

Building wallet functionality means:
- ❌ Integrating with multiple payment providers individually
- ❌ Managing different API specifications and quirks
- ❌ Handling provider downtime and failover logic
- ❌ Weeks of development time for basic wallet features
- ❌ Maintaining multiple integrations as APIs change

## ✅ The OurPocket Solution

**Integrate once. Access everything.**

- 🔌 **Single Integration**: One API connects you to Flutterwave, Paystack, Monnify, Cellulant, Chipper, and more
- 🛡️ **Failover & Fallback**: Automatic routing when providers go down
- 🎨 **Unified Interface**: Standard endpoints for all wallet operations
- ⚡ **Faster Launches**: Go live in hours, not weeks
- 🔧 **Provider Abstraction**: API changes? We handle it behind the scenes

## 🏗️ Core Features

### Wallet Operations
- **Wallet Creation**: Instant user wallet provisioning
- **Funding**: Multiple funding sources and methods
- **Transfers**: P2P, bulk, and scheduled transfers
- **Balance Queries**: Real-time balance checking
- **Transaction History**: Comprehensive transaction logs

### Developer Experience
- **Webhooks & Events**: Real-time notifications
- **KYC Management**: Unified identity verification
- **Rate Limiting**: Built-in request management
- **Comprehensive Docs**: Get started in minutes
- **SDKs**: Multiple language support

## 🎯 Who This Is For

- **Startups** building fintech products
- **Enterprises** needing embedded wallet capabilities
- **Marketplaces** requiring payment splitting
- **Gig Platforms** with complex payout needs
- **SaaS Platforms** adding financial features
- **Digital Banks** scaling payment infrastructure

## 🚀 Quick Start

### Installation
```bash
npm install ourpocket-sdk
# or
yarn add ourpocket-sdk
```

### Basic Usage
```javascript
import OurPocket from 'ourpocket-sdk';

const wallet = new OurPocket({
  apiKey: 'your-api-key',
  environment: 'sandbox' // or 'production'
});

// Create a wallet
const newWallet = await wallet.create({
  userId: 'user-123',
  currency: 'NGN'
});

// Fund wallet
const funding = await wallet.fund({
  walletId: newWallet.id,
  amount: 10000,
  source: 'bank_transfer'
});

// Transfer funds
const transfer = await wallet.transfer({
  from: 'wallet-123',
  to: 'wallet-456',
  amount: 5000,
  description: 'Payment for services'
});
```

## 🏃‍♂️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Getting Started
```bash
# Clone the repository
git clone https://github.com/yourorg/ourpocket.git
cd ourpocket

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## 📚 API Documentation

### Base URL
```
Sandbox: https://sandbox-api.ourpocket.dev
Production: https://api.ourpocket.dev
```

### Authentication
All requests require an API key in the header:
```
Authorization: Bearer your-api-key
```

### Core Endpoints

#### Wallets
- `POST /wallets` - Create wallet
- `GET /wallets/{id}` - Get wallet details
- `GET /wallets/{id}/balance` - Get wallet balance
- `GET /wallets/{id}/transactions` - Get transaction history

#### Transfers
- `POST /transfers` - Initiate transfer
- `GET /transfers/{id}` - Get transfer status
- `POST /transfers/bulk` - Bulk transfers

#### Funding
- `POST /funding/bank-transfer` - Fund via bank transfer
- `POST /funding/card` - Fund via card
- `POST /funding/ussd` - Fund via USSD

## 🔧 Supported Providers

- **Flutterwave** - Cards, Bank Transfers, Mobile Money
- **Paystack** - Cards, Bank Transfers, USSD
- **Monnify** - Bank Transfers, Cards
- **Cellulant** - Mobile Money, Bank Transfers
- **Chipper Cash** - P2P Transfers
- *More providers added regularly*

## 🛡️ Security & Compliance

- **PCI DSS Compliant** infrastructure
- **End-to-end encryption** for sensitive data
- **Webhook signature verification**
- **Rate limiting** and DDoS protection
- **Audit logs** for all transactions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@ourpocket.dev
- 💬 Discord: [Join our community](https://discord.gg/ourpocket)
- 📖 Docs: [docs.ourpocket.dev](https://docs.ourpocket.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/yourorg/ourpocket/issues)

---

**Ready to simplify your wallet integrations?** [Get your API key](https://dashboard.ourpocket.dev) and start building in minutes.
