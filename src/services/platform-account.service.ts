import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { PlatformAccount, Project } from "@/services/types";

function createPlatformAccount(payload: {
	name: string;
	companyName?: string;
	metadata?: Record<string, unknown>;
}) {
	return apiRequest<PlatformAccount>(API_ROUTES.platformAccounts.create, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function getMyPlatformAccount() {
	return apiRequest<PlatformAccount>(API_ROUTES.platformAccounts.me);
}

function listPlatformAccountProjects() {
	return apiRequest<Project[]>(API_ROUTES.platformAccounts.projects);
}

export { createPlatformAccount, getMyPlatformAccount, listPlatformAccountProjects };
