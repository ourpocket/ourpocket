import { useServiceAction } from "@/hooks/use-service-action";
import * as apiKeyService from "@/services/api-key.service";
import { ProjectApiKeyScope } from "@/services/types";

function useApiKeys() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		rotateProjectApiKey: (projectId: string, apiKeyId: string) =>
			run(() => apiKeyService.rotateProjectApiKey(projectId, apiKeyId)),
		listProjectApiKeys: (projectId: string) =>
			run(() => apiKeyService.listProjectApiKeys(projectId)),
		createProjectApiKey: (
			projectId: string,
			payload: {
				scope: ProjectApiKeyScope;
				description?: string;
				quota?: number;
			},
		) => run(() => apiKeyService.createProjectApiKey(projectId, payload)),
		revokeProjectApiKey: (projectId: string, apiKeyId: string) =>
			run(() => apiKeyService.revokeProjectApiKey(projectId, apiKeyId)),
		ensureDefaultApiKeys: (projectId: string) =>
			run(() => apiKeyService.ensureDefaultApiKeys(projectId)),
	};
}

export { useApiKeys };
