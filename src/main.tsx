import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/error-boundary";
import { setupGlobalErrorHandlers } from "./lib/error-handler";
import reportWebVitals from "./reportWebVitals.ts";

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	useEffect(() => {
		return setupGlobalErrorHandlers();
	}, []);

	return (
		<StrictMode>
			<ErrorBoundary>
				<RouterProvider router={router} />
				<Toaster position="top-center" closeButton richColors />
			</ErrorBoundary>
		</StrictMode>
	);
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<App />);
}

reportWebVitals();
