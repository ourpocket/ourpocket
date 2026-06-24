import { getAuthToken } from "@/lib/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";
const API_PUBLIC_URL = import.meta.env.VITE_API_PUBLIC_URL || "http://localhost:3000";

interface ApiEnvelope<T> {
	message: string;
	status: string;
	data: T;
}

interface ApiRequestOptions extends RequestInit {
	auth?: boolean;
	apiKey?: string;
	versioned?: boolean;
}

class ApiError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
	}
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
	const { auth = true, apiKey, versioned = true, ...requestOptions } = options;
	const headers = new Headers(requestOptions.headers);

	if (!headers.has("Content-Type") && requestOptions.body) {
		headers.set("Content-Type", "application/json");
	}

	const token = auth ? getAuthToken() : null;
	const bearer = apiKey || token;

	if (bearer) {
		headers.set("Authorization", `Bearer ${bearer}`);
	}

	const response = await fetch(`${versioned ? API_BASE_URL : API_PUBLIC_URL}${path}`, {
		...requestOptions,
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

export { API_BASE_URL, API_PUBLIC_URL, ApiError, apiRequest };
