import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import { ProviderType, type UserProvider } from "@/services/types";

interface NestedResponse<T> {
	message: string;
	data: T;
}

function unwrapNestedResponse<T>(response: T | NestedResponse<T>): T {
	if (response && typeof response === "object" && "data" in response) {
		return (response as NestedResponse<T>).data;
	}

	return response as T;
}

async function listUserProviders() {
	const response = await apiRequest<NestedResponse<UserProvider[]> | UserProvider[]>(
		API_ROUTES.userProviders.list,
		{
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

async function createUserProvider(payload: {
	type: ProviderType;
	name: string;
	config: Record<string, unknown>;
	isActive?: boolean;
}) {
	const response = await apiRequest<NestedResponse<UserProvider> | UserProvider>(
		API_ROUTES.userProviders.create,
		{
			method: "POST",
			body: JSON.stringify(payload),
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

async function getUserProvider(providerId: string) {
	const response = await apiRequest<NestedResponse<UserProvider> | UserProvider>(
		API_ROUTES.userProviders.detail(providerId),
		{
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

async function getUserProviderByType(type: ProviderType) {
	const response = await apiRequest<NestedResponse<UserProvider> | UserProvider>(
		API_ROUTES.userProviders.byType(type),
		{
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

async function updateUserProvider(
	providerId: string,
	payload: {
		name?: string;
		config?: Record<string, unknown>;
		isActive?: boolean;
	},
) {
	const response = await apiRequest<NestedResponse<UserProvider> | UserProvider>(
		API_ROUTES.userProviders.detail(providerId),
		{
			method: "PUT",
			body: JSON.stringify(payload),
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

async function toggleUserProvider(providerId: string) {
	const response = await apiRequest<NestedResponse<UserProvider> | UserProvider>(
		API_ROUTES.userProviders.toggle(providerId),
		{
			method: "PUT",
			versioned: false,
		},
	);
	return unwrapNestedResponse(response);
}

function deleteUserProvider(providerId: string) {
	return apiRequest(API_ROUTES.userProviders.detail(providerId), {
		method: "DELETE",
		versioned: false,
	});
}

export {
	createUserProvider,
	deleteUserProvider,
	getUserProvider,
	getUserProviderByType,
	listUserProviders,
	toggleUserProvider,
	updateUserProvider,
};
