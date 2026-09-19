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
import { setEnvironment, useEnvironment, useSelectedProjectId } from "@/lib/environment";
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
	const environment = useEnvironment();
	const selectedProjectId = useSelectedProjectId();
	const location = useLocation();
	const { listProjects } = useProjects();

	const [isSidebarOpen, setIsSidebarOpen] = useState(
		() => window.matchMedia("(min-width: 1024px)").matches,
	);

	useEffect(() => {
		if (!window.matchMedia("(min-width: 1024px)").matches) setIsSidebarOpen(false);
	}, [location.pathname]);
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
				{canRender ? (
					<div key={`${selectedProjectId}:${environment}`}>{children}</div>
				) : (
					<p className="text-sm text-gray-500">Loading project…</p>
				)}
			</PlatformAccountContext.Provider>
		);
	};

	return (
		<div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#171717]">
			{environment === "sandbox" && (
				<div className="flex min-h-10 w-full min-w-0 items-center justify-between gap-3 border-b border-orange-400/15 bg-orange-400/[0.07] px-4 text-xs sm:gap-4 sm:px-8">
					<div className="flex min-w-0 items-center gap-3">
						<span className="shrink-0 font-semibold text-orange-300">Sandbox mode</span>
						<span className="hidden truncate text-white/50 sm:block">
							Simulated data and balances. No real money moves in this environment.
						</span>
					</div>
					<button
						type="button"
						className="shrink-0 rounded-md border border-orange-300/20 bg-orange-400/10 px-3 py-1.5 font-medium text-orange-200 transition-colors hover:bg-orange-400/15"
						onClick={() => setEnvironment("production")}
					>
						<span className="sm:hidden">Production</span>
						<span className="hidden sm:inline">Switch to production</span>
					</button>
				</div>
			)}
			<div
				className={`flex w-full max-w-full ${environment === "sandbox" ? "min-h-[calc(100vh-2.5rem)]" : "min-h-screen"}`}
			>
				<DashboardSidebar
					mainMenuItems={mainMenuItems}
					accountMenuItems={accountMenuItems}
					supportMenuItems={supportMenuItems}
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
				/>

				<main className="w-0 min-w-0 flex-1">
					<DashboardHeader />
					<div className="min-w-0 flex-1 overflow-y-auto px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
						<div className="mx-auto w-full min-w-0 max-w-[1440px]">
							<PageInfo title={title} description={description} actionTab={actionTab} />
							{renderMainContent()}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
