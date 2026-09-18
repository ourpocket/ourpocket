import {
	PlatformAccountContext,
	type PlatformAccountContextValue,
} from "@/components/layouts/platform-account-context";
import DashboardHeader from "@/components/module/dashboard/header.tsx";
import PageInfo from "@/components/module/dashboard/page-info.tsx";
import DashboardSidebar from "@/components/module/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { accountMenuItems, mainMenuItems, supportMenuItems } from "@/config/sidebar";
import { useProjects } from "@/hooks/use-projects";
import { getSafeDashboardReturnPath } from "@/lib/onboarding";
import { clearStoredProjectId, getAuthToken, getStoredProjectId } from "@/lib/session";
import { ApiError } from "@/services/api-client";
import { getMyPlatformAccount } from "@/services/platform-account.service";
import type { PlatformAccount } from "@/services/types";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	title?: string;
	description?: string;
	actionTab?: ReactNode;
}

type PlatformAccountStatus = "checking" | "missing" | "ready" | "error";

const DashboardLayout = ({ children, title, description, actionTab }: Props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { listProjects } = useProjects();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [canRender, setCanRender] = useState(false);
	const [platformAccount, setPlatformAccount] = useState<PlatformAccount | null>(null);

	const [platformAccountStatus, setPlatformAccountStatus] =
		useState<PlatformAccountStatus>("checking");

	const [platformAccountError, setPlatformAccountError] = useState<string | null>(null);

	const loadPlatformAccount = useCallback(async () => {
		setPlatformAccountStatus("checking");
		setPlatformAccountError(null);

		try {
			const account = await getMyPlatformAccount();
			setPlatformAccount(account);
			setPlatformAccountStatus("ready");
		} catch (error) {
			if (error instanceof ApiError && error.statusCode === 404) {
				setPlatformAccountStatus("missing");

				return;
			}

			setPlatformAccountStatus("error");
			setPlatformAccountError(
				error instanceof Error
					? error.message
					: "We could not check your workspace. Please try again.",
			);
		}
	}, []);

	useEffect(() => {
		if (!getAuthToken()) {
			void navigate({ to: "/auth/login" });

			return;
		}

		void loadPlatformAccount();
	}, [loadPlatformAccount, navigate]);

	useEffect(() => {
		if (platformAccountStatus !== "missing") {
			return;
		}

		void navigate({
			to: "/onboarding/workspace",
			search: { returnTo: getSafeDashboardReturnPath(location.pathname) },
			replace: true,
		});
	}, [location.pathname, navigate, platformAccountStatus]);

	useEffect(() => {
		if (platformAccountStatus !== "ready") {
			setCanRender(false);

			return;
		}

		if (location.pathname === "/dashboard/projects") {
			setCanRender(true);

			return;
		}

		let isMounted = true;
		setCanRender(false);

		async function validateSelectedProject() {
			const projects = await listProjects();
			const storedProjectId = getStoredProjectId();
			const hasSelectedProject = projects.some((project) => project.id === storedProjectId);

			if (isMounted && !hasSelectedProject) {
				clearStoredProjectId();
				await navigate({ to: "/dashboard/projects" });

				return;
			}

			if (isMounted) {
				setCanRender(true);
			}
		}

		void validateSelectedProject();

		return () => {
			isMounted = false;
		};
	}, [location.pathname, navigate, platformAccountStatus]);

	const platformAccountContext = useMemo<PlatformAccountContextValue | null>(() => {
		if (!platformAccount) {
			return null;
		}

		return {
			platformAccount,
			refreshPlatformAccount: loadPlatformAccount,
		};
	}, [loadPlatformAccount, platformAccount]);

	const renderMainContent = () => {
		if (platformAccountStatus === "checking") {
			return (
				<div className="flex min-h-48 items-center gap-3 text-sm text-gray-400">
					<LoaderCircle className="size-4 animate-spin text-orange-400" aria-hidden="true" />
					Checking your workspace…
				</div>
			);
		}

		if (platformAccountStatus === "error") {
			return (
				<div className="flex min-h-48 max-w-xl flex-col items-start justify-center gap-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-300">
						<AlertCircle className="size-5" aria-hidden="true" />
					</div>
					<div className="space-y-1">
						<h2 className="font-semibold text-white">Unable to load your workspace</h2>
						<p className="text-sm leading-6 text-gray-400">
							{platformAccountError || "Check your connection and try again."}
						</p>
					</div>
					<Button onClick={() => void loadPlatformAccount()}>Try again</Button>
				</div>
			);
		}

		if (platformAccountStatus === "missing") {
			return <p className="text-sm text-gray-500">Opening workspace setup…</p>;
		}

		if (!platformAccountContext) {
			return null;
		}

		return (
			<PlatformAccountContext.Provider value={platformAccountContext}>
				{canRender ? children : <p className="text-sm text-gray-500">Loading project…</p>}
			</PlatformAccountContext.Provider>
		);
	};

	return (
		<div className="flex min-h-screen">
			<DashboardSidebar
				mainMenuItems={mainMenuItems}
				accountMenuItems={accountMenuItems}
				supportMenuItems={supportMenuItems}
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>

			<main className="w-full">
				<DashboardHeader />
				<div className="flex-1 overflow-y-auto p-6">
					<div className="container">
						<PageInfo title={title} description={description} actionTab={actionTab} />
						{renderMainContent()}
					</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
