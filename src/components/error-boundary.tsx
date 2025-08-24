import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="rounded-lg bg-red-50 p-8 text-center">
						<h1 className="mb-4 text-2xl font-bold text-red-800">Oops! Something went wrong</h1>
						<p className="text-red-600">{this.state.error?.message}</p>
						<button
							type="button"
							className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
							onClick={() => window.location.reload()}
						>
							Refresh Page.
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
