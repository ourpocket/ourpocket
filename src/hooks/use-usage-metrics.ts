import { useServiceAction } from "@/hooks/use-service-action";
import * as usageService from "@/services/usage.service";

function useUsageMetrics() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		getUsageMetrics: (projectId: string) => run(() => usageService.getUsageMetrics(projectId)),
	};
}

export { useUsageMetrics };
