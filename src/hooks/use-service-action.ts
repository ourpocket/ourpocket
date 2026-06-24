import { useErrorHandler } from "@/hooks/use-error-handler";
import { useCallback, useState } from "react";

function useServiceAction() {
	const handleError = useErrorHandler();
	const [isLoading, setIsLoading] = useState(false);

	const run = useCallback(
		async <T>(action: () => Promise<T>, onSuccess?: (value: T) => void) => {
			setIsLoading(true);

			try {
				const value = await action();
				onSuccess?.(value);
				return value;
			} catch (error) {
				handleError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[handleError],
	);

	return {
		isLoading,
		run,
	};
}

export { useServiceAction };
