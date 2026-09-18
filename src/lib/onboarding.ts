const DEFAULT_DASHBOARD_PATH = "/dashboard/projects";

function getSafeDashboardReturnPath(value?: string): string {
	if (value === "/dashboard" || value === "/dashboard/" || value?.startsWith("/dashboard/")) {
		return value;
	}

	return DEFAULT_DASHBOARD_PATH;
}

export { DEFAULT_DASHBOARD_PATH, getSafeDashboardReturnPath };
