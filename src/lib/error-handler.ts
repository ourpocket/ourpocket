import { toast } from "sonner";

function globalErrorHandler(event: ErrorEvent | PromiseRejectionEvent) {
	const error = event instanceof ErrorEvent ? event.error : event.reason;
	const message = error?.message || "An unexpected error occurred";

	console.error("Unhandled error:", error);

	toast.error(message);

	event.preventDefault();
}

export function setupGlobalErrorHandlers() {
	window.addEventListener("error", globalErrorHandler);

	window.addEventListener("unhandledrejection", globalErrorHandler);

	return () => {
		window.removeEventListener("error", globalErrorHandler);
		window.removeEventListener("unhandledrejection", globalErrorHandler);
	};
}
