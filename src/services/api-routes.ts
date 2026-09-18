const API_ROUTES = {
	auth: {
		register: "/auth/register",
		login: "/auth/login",
		verifyEmail: "/auth/verify-email",
		resetPassword: "/auth/reset-password",
		forgotPassword: "/auth/forgotten-password",
		requestVerifyEmail: "/auth/request-verify-email",
	},
	platformAccounts: {
		create: "/platform-accounts",
		me: "/platform-accounts/me",
		projects: "/platform-accounts/me/projects",
	},
	providerCatalog: {
		list: "/provider-catalog",
	},
	projects: {
		list: "/projects",
		create: "/projects",
		detail: (projectId: string) => `/projects/${projectId}`,
		apiKeys: {
			list: (projectId: string) => `/projects/${projectId}/api-keys`,
			create: (projectId: string) => `/projects/${projectId}/api-keys`,
			revoke: (projectId: string, apiKeyId: string) =>
				`/projects/${projectId}/api-keys/${apiKeyId}`,
		},
		providers: {
			list: (projectId: string) => `/projects/${projectId}/providers`,
			configure: (projectId: string) => `/projects/${projectId}/providers`,
			connect: (projectId: string) => `/projects/${projectId}/providers/connect`,
		},
		webhooks: {
			list: (projectId: string) => `/projects/${projectId}/webhooks`,
			create: (projectId: string) => `/projects/${projectId}/webhooks`,
			delete: (projectId: string, webhookId: string) =>
				`/projects/${projectId}/webhooks/${webhookId}`,
		},
		usageMetrics: (projectId: string) => `/projects/${projectId}/usage-metrics`,
	},
	wallets: {
		create: "/wallets/create",
		get: (walletId: string) => `/wallets/${walletId}`,
		credit: "/wallets/credit",
		debit: "/wallets/debit",
		transfer: "/wallets/transfer",
	},
	transactions: {
		create: "/transactions",
		get: (transactionId: string) => `/transactions/${transactionId}`,
	},
	webhooks: {
		receive: "/ourpocket/webhook",
	},
	walletProviders: {
		list: "/wallet-providers",
		add: "/wallet-providers/add",
		remove: (type: string) => `/wallet-providers/${type}`,
		createWallet: "/wallet-providers/create-wallet",
		actions: "/wallet-providers/actions",
	},
	userProviders: {
		list: "/user-providers",
		create: "/user-providers",
		detail: (providerId: string) => `/user-providers/${providerId}`,
		byType: (type: string) => `/user-providers/type/${type}`,
		toggle: (providerId: string) => `/user-providers/${providerId}/toggle`,
	},
} as const;

export { API_ROUTES };
