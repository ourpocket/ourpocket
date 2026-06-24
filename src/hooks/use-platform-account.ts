import { useServiceAction } from "@/hooks/use-service-action";
import * as platformAccountService from "@/services/platform-account.service";

function usePlatformAccount() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		createPlatformAccount: (payload: {
			name: string;
			companyName?: string;
			metadata?: Record<string, unknown>;
		}) => run(() => platformAccountService.createPlatformAccount(payload)),
		getMyPlatformAccount: () => run(() => platformAccountService.getMyPlatformAccount()),
		listPlatformAccountProjects: () =>
			run(() => platformAccountService.listPlatformAccountProjects()),
	};
}

export { usePlatformAccount };
