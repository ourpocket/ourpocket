import { DEFAULT_DASHBOARD_PATH, getSafeDashboardReturnPath } from "@/lib/onboarding";
import { describe, expect, it } from "vitest";

describe("getSafeDashboardReturnPath", () => {
	it("retains internal dashboard destinations", () => {
		expect(getSafeDashboardReturnPath("/dashboard/wallets")).toBe("/dashboard/wallets");
	});

	it("falls back for missing or external destinations", () => {
		expect(getSafeDashboardReturnPath(undefined)).toBe(DEFAULT_DASHBOARD_PATH);
		expect(getSafeDashboardReturnPath("https://malicious.example")).toBe(DEFAULT_DASHBOARD_PATH);
	});
});
