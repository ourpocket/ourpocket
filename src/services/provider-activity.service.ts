import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import { providerOverviewSchema } from "@/services/financial.service";
import { z } from "zod";

const providerSchema = z.enum(["paystack", "flutterwave", "mono"]);

type ConnectedPaymentProvider = z.infer<typeof providerSchema>;

type ProviderOverview = z.infer<typeof providerOverviewSchema>;

async function getProviderOverview(
	projectId: string,
	provider: ConnectedPaymentProvider,
	query: { from?: string; to?: string; page?: number; limit?: number } = {},
): Promise<ProviderOverview> {
	const params = new URLSearchParams();
	if (query.from) params.set("from", query.from);
	if (query.to) params.set("to", query.to);
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));
	const suffix = params.size ? `?${params}` : "";
	return providerOverviewSchema.parse(
		await apiRequest<unknown>(
			`${API_ROUTES.projects.providers.overview(projectId, provider)}${suffix}`,
		),
	);
}

export { getProviderOverview, providerSchema };
export type { ConnectedPaymentProvider, ProviderOverview };
