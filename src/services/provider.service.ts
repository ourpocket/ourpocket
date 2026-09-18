import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import {
	type LegacyWalletProvider,
	type ProjectProvider,
	type ProviderCatalog,
	ProviderType,
	WalletProviderAction,
} from "@/services/types";

function listProjectProviders(projectId: string) {
	return apiRequest<ProjectProvider[]>(API_ROUTES.projects.providers.list(projectId));
}

function listProviderCatalog() {
	return apiRequest<ProviderCatalog[]>(API_ROUTES.providerCatalog.list);
}

function connectProjectProvider(
	projectId: string,
	payload: {
		providerId: string;
		config: Record<string, string>;
		isActive?: boolean;
	},
) {
	return apiRequest<ProjectProvider>(API_ROUTES.projects.providers.connect(projectId), {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function configureProjectProvider(
	projectId: string,
	payload: {
		type: ProviderType;
		config: Record<string, unknown>;
		isActive?: boolean;
	},
) {
	return apiRequest<ProjectProvider>(API_ROUTES.projects.providers.configure(projectId), {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function listWalletProvidersCatalog() {
	return apiRequest<LegacyWalletProvider[]>(API_ROUTES.walletProviders.list, {
		versioned: false,
	});
}

function addWalletProvider(payload: {
	type: ProviderType;
	config: Record<string, unknown>;
}) {
	return apiRequest<LegacyWalletProvider>(API_ROUTES.walletProviders.add, {
		method: "POST",
		body: JSON.stringify(payload),
		versioned: false,
	});
}

function removeWalletProvider(type: ProviderType) {
	return apiRequest(API_ROUTES.walletProviders.remove(type), {
		method: "DELETE",
		versioned: false,
	});
}

function createWalletWithProvider(
	projectApiKey: string,
	payload: {
		provider: ProviderType;
		payload: Record<string, unknown>;
	},
) {
	return apiRequest<unknown>(API_ROUTES.walletProviders.createWallet, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
		versioned: false,
	});
}

function runWalletProviderAction(
	projectApiKey: string,
	payload: {
		provider: ProviderType;
		action: WalletProviderAction;
		payload: Record<string, unknown>;
	},
) {
	return apiRequest<unknown>(API_ROUTES.walletProviders.actions, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
		versioned: false,
	});
}

export {
	addWalletProvider,
	configureProjectProvider,
	connectProjectProvider,
	createWalletWithProvider,
	listProjectProviders,
	listProviderCatalog,
	listWalletProvidersCatalog,
	removeWalletProvider,
	runWalletProviderAction,
};
