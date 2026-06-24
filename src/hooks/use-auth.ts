import { useServiceAction } from "@/hooks/use-service-action";
import * as authService from "@/services/auth.service";
import type { RegisterPayload } from "@/services/types";

function useAuth() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		login: (payload: { email: string; password: string }) => run(() => authService.login(payload)),
		register: (payload: RegisterPayload) => run(() => authService.register(payload)),
		verifyEmail: (payload: { email: string; token: string }) =>
			run(() => authService.verifyEmail(payload)),
		requestPasswordReset: (email: string) => run(() => authService.requestPasswordReset(email)),
		resetPassword: (payload: {
			email: string;
			token: string;
			newPassword: string;
		}) => run(() => authService.resetPassword(payload)),
		requestVerificationEmail: (email: string) =>
			run(() => authService.requestVerificationEmail(email)),
	};
}

export { useAuth };
