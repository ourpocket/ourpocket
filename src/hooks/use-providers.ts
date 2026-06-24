import { useServiceAction } from "@/hooks/use-service-action";
import * as providerService from "@/services/provider.service";
import { ProviderType, WalletProviderAction } from "@/services/types";

function useProviders() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		listProjectProviders: (projectId: string) =>
			run(() => providerService.listProjectProviders(projectId)),
		configureProjectProvider: (
			projectId: string,
			payload: {
				type: ProviderType;
				config: Record<string, unknown>;
				isActive?: boolean;
			},
		) => run(() => providerService.configureProjectProvider(projectId, payload)),
		listWalletProvidersCatalog: () => run(() => providerService.listWalletProvidersCatalog()),
		addWalletProvider: (payload: {
			type: ProviderType;
			config: Record<string, unknown>;
		}) => run(() => providerService.addWalletProvider(payload)),
		removeWalletProvider: (type: ProviderType) =>
			run(() => providerService.removeWalletProvider(type)),
		createWalletWithProvider: (
			projectApiKey: string,
			payload: {
				provider: ProviderType;
				payload: Record<string, unknown>;
			},
		) => run(() => providerService.createWalletWithProvider(projectApiKey, payload)),
		runWalletProviderAction: (
			projectApiKey: string,
			payload: {
				provider: ProviderType;
				action: WalletProviderAction;
				payload: Record<string, unknown>;
			},
		) => run(() => providerService.runWalletProviderAction(projectApiKey, payload)),
	};
}

export { useProviders };
