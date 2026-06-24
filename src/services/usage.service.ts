import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { UsageMetrics } from "@/services/types";

function getUsageMetrics(projectId: string) {
	return apiRequest<UsageMetrics>(API_ROUTES.projects.usageMetrics(projectId));
}

export { getUsageMetrics };
