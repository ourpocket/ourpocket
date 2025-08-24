import { useCallback } from "react";
import { toast } from "sonner";

type ErrorWithMessage = {
	message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as Record<string, unknown>).message === "string"
	);
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	if (isErrorWithMessage(maybeError)) return maybeError;

	try {
		return new Error(JSON.stringify(maybeError));
	} catch {
		return new Error(String(maybeError));
	}
}

export function getErrorMessage(error: unknown) {
	return toErrorWithMessage(error).message;
}

export function useErrorHandler() {
	return useCallback((error: unknown) => {
		const message = getErrorMessage(error);
		toast.error(message);
		console.error(error);
	}, []);
}
