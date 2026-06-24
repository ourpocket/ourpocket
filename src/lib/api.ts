import { getAuthToken, getStoredProjectId, setStoredProjectId } from "@/lib/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

enum ProjectApiKeyScope {
	TEST = "test",
	LIVE = "live",
}

enum ProviderType {
	PAYSTACK = "paystack",
	FLUTTERWAVE = "flutterwave",
	PAGA = "paga",
	FINGRA = "fingra",
}

enum WebhookEvent {
	TRANSACTION_SUCCESS = "transaction.success",
	TRANSACTION_FAILED = "transaction.failed",
	WALLET_CREATED = "wallet.created",
	WALLET_CREDITED = "wallet.credited",
	WALLET_DEBITED = "wallet.debited",
	TRANSFER_SUCCESS = "transfer.success",
	TRANSFER_FAILED = "transfer.failed",
}

interface ApiEnvelope<T> {
	message: string;
	status: string;
	data: T;
}

interface LoginResponse {
	token: string;
	role?: string | null;
	status?: string | null;
}

interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	companyName?: string;
	country: string;
	provider: "local";
	acceptTerms: boolean;
}

interface Project {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	createdAt: string;
}

interface ProjectApiKey {
	id: string;
	rawKey?: string;
	keyPreview?: string;
	scope: ProjectApiKeyScope;
	description?: string;
	used?: number;
	quota?: number;
	createdAt: string;
}

interface ProjectProvider {
	id: string;
	type: ProviderType;
	config: Record<string, unknown>;
	isActive: boolean;
	createdAt: string;
}

interface WebhookEndpoint {
	id: string;
	url: string;
	secret: string;
	isActive: boolean;
	eventTypes?: WebhookEvent[] | null;
	createdAt: string;
}

interface UsageMetrics {
	totals: {
		apiRequests: number;
		successfulTransactions: number;
		failedTransactions: number;
		activeWallets: number;
		transactionVolume: number;
		successRate: number;
	};
	providerPerformance: Array<{
		provider: string;
		total: number;
		successful: number;
		failed: number;
		successRate: number;
	}>;
	monthlyTransactionVolume: Array<{
		month: string;
		value: number;
	}>;
	apiUsage: Array<{
		day: string;
		requests: number;
	}>;
}

class ApiError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
	}
}

async function apiRequest<T>(path: string, options: RequestInit = {}, useAuth = true): Promise<T> {
	const headers = new Headers(options.headers);

	if (!headers.has("Content-Type") && options.body) {
		headers.set("Content-Type", "application/json");
	}

	if (useAuth) {
		const token = getAuthToken();
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
	});
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new ApiError(payload?.message || payload?.error || "Request failed", response.status);
	}

	if (payload && typeof payload === "object" && "data" in payload) {
		return (payload as ApiEnvelope<T>).data;
	}

	return payload as T;
}

function login(payload: { email: string; password: string }) {
	return apiRequest<LoginResponse>(
		"/auth/login",
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
		false,
	);
}

function register(payload: RegisterPayload) {
	return apiRequest(
		"/auth/register",
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
		false,
	);
}

function requestPasswordReset(email: string) {
	return apiRequest(
		"/auth/forgotten-password",
		{
			method: "POST",
			body: JSON.stringify({ email }),
		},
		false,
	);
}

function resetPassword(payload: {
	email: string;
	token: string;
	newPassword: string;
}) {
	return apiRequest(
		"/auth/reset-password",
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
		false,
	);
}

function listProjects() {
	return apiRequest<Project[]>("/projects");
}

function createProject(payload: {
	name: string;
	slug?: string;
	description?: string;
}) {
	return apiRequest<Project>("/projects", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function listProjectApiKeys(projectId: string) {
	return apiRequest<ProjectApiKey[]>(`/projects/${projectId}/api-keys`);
}

function createProjectApiKey(
	projectId: string,
	payload: {
		scope: ProjectApiKeyScope;
		description?: string;
		quota?: number;
	},
) {
	return apiRequest<ProjectApiKey>(`/projects/${projectId}/api-keys`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function revokeProjectApiKey(projectId: string, apiKeyId: string) {
	return apiRequest(`/projects/${projectId}/api-keys/${apiKeyId}`, {
		method: "DELETE",
	});
}

function listProjectProviders(projectId: string) {
	return apiRequest<ProjectProvider[]>(`/projects/${projectId}/providers`);
}

function configureProjectProvider(
	projectId: string,
	payload: {
		type: ProviderType;
		config: Record<string, unknown>;
		isActive?: boolean;
	},
) {
	return apiRequest<ProjectProvider>(`/projects/${projectId}/providers`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function listWebhooks(projectId: string) {
	return apiRequest<WebhookEndpoint[]>(`/projects/${projectId}/webhooks`);
}

function createWebhook(
	projectId: string,
	payload: { url: string; eventTypes?: WebhookEvent[]; isActive?: boolean },
) {
	return apiRequest<WebhookEndpoint>(`/projects/${projectId}/webhooks`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function deleteWebhook(projectId: string, webhookId: string) {
	return apiRequest(`/projects/${projectId}/webhooks/${webhookId}`, {
		method: "DELETE",
	});
}

function getUsageMetrics(projectId: string) {
	return apiRequest<UsageMetrics>(`/projects/${projectId}/usage-metrics`);
}

async function ensureDefaultProject() {
	const storedProjectId = getStoredProjectId();
	const projects = await listProjects();
	const storedProject = projects.find((project) => project.id === storedProjectId);

	if (storedProject) {
		return storedProject;
	}

	if (projects[0]) {
		setStoredProjectId(projects[0].id);
		return projects[0];
	}

	const project = await createProject({
		name: "Default Project",
		slug: "default-project",
		description: "Main OurPocket integration project",
	});
	setStoredProjectId(project.id);
	return project;
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

export {
	ApiError,
	ProjectApiKeyScope,
	ProviderType,
	WebhookEvent,
	configureProjectProvider,
	createProjectApiKey,
	createWebhook,
	deleteWebhook,
	ensureDefaultApiKeys,
	ensureDefaultProject,
	getUsageMetrics,
	listProjectApiKeys,
	listProjectProviders,
	listProjects,
	listWebhooks,
	login,
	register,
	requestPasswordReset,
	resetPassword,
	revokeProjectApiKey,
};

export type {
	LoginResponse,
	Project,
	ProjectApiKey,
	ProjectProvider,
	RegisterPayload,
	UsageMetrics,
	WebhookEndpoint,
};
