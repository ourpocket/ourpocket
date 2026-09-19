enum ProjectApiKeyScope {
	TEST = "test",
	LIVE = "live",
}

enum ProviderType {
	PAYSTACK = "paystack",
	FLUTTERWAVE = "flutterwave",
	TURNKEY = "turnkey",
	PRIVY = "privy",
	PAGA = "paga",
	FINGRA = "fingra",
}

enum ProviderCatalogStatus {
	DRAFT = "draft",
	COMING_SOON = "coming_soon",
	ACTIVE = "active",
	MAINTENANCE = "maintenance",
	RETIRED = "retired",
}

enum ProviderCategory {
	AFRICA = "africa",
	GLOBAL = "global",
	WALLET_INFRASTRUCTURE = "wallet_infrastructure",
	DATA_VERIFICATION = "data_verification",
}

enum ProviderCapability {
	PAYMENTS = "payments",
	REFUNDS = "refunds",
	WALLET_OPERATIONS = "wallet_operations",
	PAYMENT_COLLECTION = "payment_collection",
	BANK_DATA = "bank_data",
	IDENTITY_VERIFICATION = "identity_verification",
	TRANSFERS = "transfers",
	SIGNING = "signing",
	POLICIES = "policies",
}

enum RoutingStrategy {
	BEST_SUCCESS_RATE = "best_success_rate",
	LOWEST_FEES = "lowest_fees",
	FASTEST_SETTLEMENT = "fastest_settlement",
	CUSTOM_PRIORITY = "custom_priority",
}

enum TransactionType {
	CREDIT = "credit",
	DEBIT = "debit",
	TRANSFER = "transfer",
}

enum WalletProviderAction {
	CREATE_WALLET = "create_wallet",
	FETCH_WALLET = "fetch_wallet",
	LIST_WALLETS = "list_wallets",
	DEPOSIT = "deposit",
	WITHDRAW = "withdraw",
}

enum WebhookEvent {
	TRANSACTION_SUCCESS = "transaction.success",
	TRANSACTION_FAILED = "transaction.failed",
	WALLET_CREATED = "wallet.created",
	WALLET_CREDITED = "wallet.credited",
	WALLET_DEBITED = "wallet.debited",
	TRANSFER_SUCCESS = "transfer.success",
	TRANSFER_FAILED = "transfer.failed",
}

interface LoginResponse {
	token: string;
	role?: string | null;
	status?: string | null;
}

interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	companyName?: string;
	country: string;
	provider: "local";
	acceptTerms: boolean;
}

interface PlatformAccount {
	id: string;
	name: string;
	companyName?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
}

interface Project {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
}

interface ProjectApiKey {
	id: string;
	rawKey?: string;
	keyPreview?: string;
	scope: ProjectApiKeyScope;
	description?: string;
	used?: number;
	quota?: number;
	createdAt: string;
}

interface ProjectProvider {
	id: string;
	type: ProviderType;
	providerCatalogId?: string | null;
	provider?: ProviderCatalog | null;
	config: Record<string, unknown>;
	isActive: boolean;
	createdAt: string;
}

interface ProviderCredentialField {
	key: string;
	label: string;
	type: "secret" | "text";
	required: boolean;
	placeholder?: string;
}

interface ProviderCatalog {
	id: string;
	slug: string;
	name: string;
	description: string;
	logoAsset: string;
	category: ProviderCategory;
	capabilities: ProviderCapability[];
	credentialFields: ProviderCredentialField[];
	adapterType?: ProviderType | null;
	status: ProviderCatalogStatus;
	sortOrder: number;
}

interface WebhookEndpoint {
	id: string;
	url: string;
	secret: string;
	isActive: boolean;
	eventTypes?: WebhookEvent[] | null;
	createdAt: string;
}

interface UsageMetrics {
	totals: {
		apiRequests: number;
		successfulTransactions: number;
		failedTransactions: number;
		unknownTransactions?: number;
		activeWallets: number;
		transactionVolume: number;
		successRate: number;
	};
	providerPerformance: Array<{
		provider: string;
		total: number;
		successful: number;
		failed: number;
		successRate: number;
	}>;
	monthlyTransactionVolume: Array<{
		month: string;
		value: number;
	}>;
	apiUsage: Array<{
		day: string;
		requests: number;
	}>;
}

interface Wallet {
	id: string;
	currency: string;
	createdAt: string;
	account?: Record<string, unknown> | null;
}

interface WalletBalanceResponse {
	wallet: Wallet;
	balance: unknown;
}

interface ProviderCredential {
	provider: ProviderType;
	apiKey: string;
	successRate?: number;
	feePercentage?: number;
	settlementMinutes?: number;
	priority?: number;
}

interface ProviderRoutingPayload {
	provider?: ProviderType;
	apiKey?: string;
	providerApiKey?: string;
	routingStrategy?: RoutingStrategy;
	providerPriority?: ProviderType[];
	providerCredentials?: ProviderCredential[];
	providerPayload?: Record<string, unknown>;
}

interface CreateWalletPayload {
	currency?: string;
	userId?: string;
	provider?: ProviderType;
	providerCredentials?: ProviderCredential[];
	providerPayload?: Record<string, unknown>;
}

interface WalletLedgerPayload extends ProviderRoutingPayload {
	walletId: string;
	amount: string;
	currency: string;
	reference: string;
	metadata?: Record<string, unknown>;
}

interface TransferWalletPayload {
	fromWalletId: string;
	toWalletId: string;
	amount: string;
	currency: string;
	reference: string;
	metadata?: Record<string, unknown>;
}

interface Transaction {
	id: string;
	type: TransactionType;
	status: "pending" | "success" | "failed";
	provider?: ProviderType | null;
	amount: string;
	currency: string;
	reference: string;
	walletId?: string | null;
	fromWalletId?: string | null;
	toWalletId?: string | null;
	metadata?: Record<string, unknown> | null;
	response?: Record<string, unknown> | null;
	createdAt: string;
}

interface CreateTransactionPayload extends ProviderRoutingPayload {
	type: TransactionType;
	amount: string;
	currency: string;
	reference: string;
	walletId?: string;
	fromWalletId?: string;
	toWalletId?: string;
	metadata?: Record<string, unknown>;
}

interface LegacyWalletProvider {
	type: ProviderType;
	name: string;
	isActive: boolean;
	config: Record<string, unknown>;
}

interface UserProvider {
	id: string;
	type: ProviderType;
	name: string;
	config?: Record<string, unknown> | null;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export {
	ProjectApiKeyScope,
	ProviderType,
	ProviderCatalogStatus,
	ProviderCategory,
	ProviderCapability,
	RoutingStrategy,
	TransactionType,
	WalletProviderAction,
	WebhookEvent,
};

export type {
	CreateTransactionPayload,
	CreateWalletPayload,
	LegacyWalletProvider,
	LoginResponse,
	PlatformAccount,
	ProviderCredential,
	Project,
	ProjectApiKey,
	ProjectProvider,
	ProviderCredentialField,
	ProviderCatalog,
	RegisterPayload,
	Transaction,
	TransferWalletPayload,
	UsageMetrics,
	UserProvider,
	Wallet,
	WalletBalanceResponse,
	WalletLedgerPayload,
	WebhookEndpoint,
};
