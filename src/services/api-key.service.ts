import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import { type ProjectApiKey, ProjectApiKeyScope } from "@/services/types";

function listProjectApiKeys(projectId: string) {
	return apiRequest<ProjectApiKey[]>(API_ROUTES.projects.apiKeys.list(projectId));
}

function createProjectApiKey(
	projectId: string,
	payload: {
		scope: ProjectApiKeyScope;
		description?: string;
		quota?: number;
	},
) {
	return apiRequest<ProjectApiKey>(API_ROUTES.projects.apiKeys.create(projectId), {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function revokeProjectApiKey(projectId: string, apiKeyId: string) {
	return apiRequest(API_ROUTES.projects.apiKeys.revoke(projectId, apiKeyId), {
		method: "DELETE",
	});
}

async function ensureDefaultApiKeys(projectId: string) {
	const existingKeys = await listProjectApiKeys(projectId);
	const createdKeys: ProjectApiKey[] = [];

	if (!existingKeys.some((key) => key.scope === ProjectApiKeyScope.TEST)) {
		createdKeys.push(
			await createProjectApiKey(projectId, {
				scope: ProjectApiKeyScope.TEST,
				description: "Test environment API key",
			}),
		);
	}

	if (!existingKeys.some((key) => key.scope === ProjectApiKeyScope.LIVE)) {
		createdKeys.push(
			await createProjectApiKey(projectId, {
				scope: ProjectApiKeyScope.LIVE,
				description: "Live environment API key",
			}),
		);
	}

	return [...createdKeys, ...existingKeys];
}

export { createProjectApiKey, ensureDefaultApiKeys, listProjectApiKeys, revokeProjectApiKey };

export function rotateProjectApiKey(projectId: string, apiKeyId: string) {
	return apiRequest<ProjectApiKey>(`/projects/${projectId}/api-keys/${apiKeyId}/rotate`, {
		method: "POST",
		body: "{}",
	});
}
