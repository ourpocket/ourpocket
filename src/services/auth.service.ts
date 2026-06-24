import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { LoginResponse, RegisterPayload } from "@/services/types";

function login(payload: { email: string; password: string }) {
	return apiRequest<LoginResponse>(API_ROUTES.auth.login, {
		method: "POST",
		body: JSON.stringify(payload),
		auth: false,
	});
}

function register(payload: RegisterPayload) {
	return apiRequest(API_ROUTES.auth.register, {
		method: "POST",
		body: JSON.stringify(payload),
		auth: false,
	});
}

function verifyEmail(payload: { email: string; token: string }) {
	return apiRequest(API_ROUTES.auth.verifyEmail, {
		method: "POST",
		body: JSON.stringify(payload),
		auth: false,
	});
}

function requestPasswordReset(email: string) {
	return apiRequest(API_ROUTES.auth.forgotPassword, {
		method: "POST",
		body: JSON.stringify({ email }),
		auth: false,
	});
}

function resetPassword(payload: {
	email: string;
	token: string;
	newPassword: string;
}) {
	return apiRequest(API_ROUTES.auth.resetPassword, {
		method: "POST",
		body: JSON.stringify(payload),
		auth: false,
	});
}

function requestVerificationEmail(email: string) {
	return apiRequest(API_ROUTES.auth.requestVerifyEmail, {
		method: "POST",
		body: JSON.stringify({ email }),
		auth: false,
	});
}

export {
	login,
	register,
	requestPasswordReset,
	requestVerificationEmail,
	resetPassword,
	verifyEmail,
};
