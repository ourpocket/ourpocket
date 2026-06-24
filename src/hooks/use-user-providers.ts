import { useServiceAction } from "@/hooks/use-service-action";
import { ProviderType } from "@/services/types";
import * as userProviderService from "@/services/user-provider.service";

function useUserProviders() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		listUserProviders: () => run(() => userProviderService.listUserProviders()),
		createUserProvider: (payload: {
			type: ProviderType;
			name: string;
			config: Record<string, unknown>;
			isActive?: boolean;
		}) => run(() => userProviderService.createUserProvider(payload)),
		getUserProvider: (providerId: string) =>
			run(() => userProviderService.getUserProvider(providerId)),
		getUserProviderByType: (type: ProviderType) =>
			run(() => userProviderService.getUserProviderByType(type)),
		updateUserProvider: (
			providerId: string,
			payload: {
				name?: string;
				config?: Record<string, unknown>;
				isActive?: boolean;
			},
		) => run(() => userProviderService.updateUserProvider(providerId, payload)),
		toggleUserProvider: (providerId: string) =>
			run(() => userProviderService.toggleUserProvider(providerId)),
		deleteUserProvider: (providerId: string) =>
			run(() => userProviderService.deleteUserProvider(providerId)),
	};
}

export { useUserProviders };
