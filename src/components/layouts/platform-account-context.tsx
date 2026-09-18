import type { PlatformAccount } from "@/services/types";
import { createContext, useContext } from "react";

interface PlatformAccountContextValue {
	platformAccount: PlatformAccount;
	refreshPlatformAccount: () => Promise<void>;
}

const PlatformAccountContext = createContext<PlatformAccountContextValue | null>(null);

function useDashboardPlatformAccount(): PlatformAccountContextValue {
	const context = useContext(PlatformAccountContext);

	if (!context) {
		throw new Error("useDashboardPlatformAccount must be used inside DashboardLayout");
	}

	return context;
}

export { PlatformAccountContext, useDashboardPlatformAccount };

export type { PlatformAccountContextValue };
