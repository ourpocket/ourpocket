import { apiRequest } from "@/services/api-client";
import type { UsageMetrics } from "@/services/types";

function getUsageMetrics(projectId: string) {
	return apiRequest<UsageMetrics>(`/projects/${projectId}/financial/metrics`);
}

export { getUsageMetrics };
