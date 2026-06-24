import { useServiceAction } from "@/hooks/use-service-action";
import { ProviderType, type WebhookEvent } from "@/services/types";
import * as webhookService from "@/services/webhook.service";

function useWebhooks() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		listWebhooks: (projectId: string) => run(() => webhookService.listWebhooks(projectId)),
		createWebhook: (
			projectId: string,
			payload: { url: string; eventTypes?: WebhookEvent[]; isActive?: boolean },
		) => run(() => webhookService.createWebhook(projectId, payload)),
		deleteWebhook: (projectId: string, webhookId: string) =>
			run(() => webhookService.deleteWebhook(projectId, webhookId)),
		receiveUnifiedWebhook: (
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
		) => run(() => webhookService.receiveUnifiedWebhook(projectApiKey, payload)),
	};
}

export { useWebhooks };
