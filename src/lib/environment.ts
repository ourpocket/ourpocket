import { useSyncExternalStore } from "react";
import { getStoredProjectId } from "./session";

export type FinancialEnvironment = "sandbox" | "production";

function environmentKey() {
	return `ourpocket.environment.${getStoredProjectId() ?? "none"}`;
}

export function getEnvironment(): FinancialEnvironment {
	return window.localStorage.getItem(environmentKey()) === "production" ? "production" : "sandbox";
}

export function setEnvironment(environment: FinancialEnvironment) {
	window.localStorage.setItem(environmentKey(), environment);
	window.dispatchEvent(new Event("ourpocket.environment"));
}

function subscribe(callback: () => void) {
	window.addEventListener("ourpocket.environment", callback);
	window.addEventListener("storage", callback);

	return () => {
		window.removeEventListener("ourpocket.environment", callback);
		window.removeEventListener("storage", callback);
	};
}

export function useEnvironment() {
	return useSyncExternalStore(subscribe, getEnvironment, () => "sandbox");
}

export function useSelectedProjectId() {
	return useSyncExternalStore(subscribe, getStoredProjectId, () => null);
}
