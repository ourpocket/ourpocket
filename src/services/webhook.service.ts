import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import { ProviderType, type WebhookEndpoint, type WebhookEvent } from "@/services/types";

function listWebhooks(projectId: string) {
	return apiRequest<WebhookEndpoint[]>(API_ROUTES.projects.webhooks.list(projectId));
}

function createWebhook(
	projectId: string,
	payload: { url: string; eventTypes?: WebhookEvent[]; isActive?: boolean },
) {
	return apiRequest<WebhookEndpoint>(API_ROUTES.projects.webhooks.create(projectId), {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function deleteWebhook(projectId: string, webhookId: string) {
	return apiRequest(API_ROUTES.projects.webhooks.delete(projectId, webhookId), {
		method: "DELETE",
	});
}

function receiveUnifiedWebhook(
	projectApiKey: string,
	payload: {
		provider: ProviderType;
		event?: WebhookEvent;
		amount?: number;
		currency?: string;
		reference?: string;
		providerReference?: string;
		data?: Record<string, unknown>;
	},
) {
	return apiRequest(API_ROUTES.webhooks.receive, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
		versioned: false,
	});
}

export { createWebhook, deleteWebhook, listWebhooks, receiveUnifiedWebhook };
