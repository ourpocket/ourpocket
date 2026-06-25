import DashboardHeader from "@/components/module/dashboard/header.tsx";
import PageInfo from "@/components/module/dashboard/page-info.tsx";
import DashboardSidebar from "@/components/module/dashboard/sidebar";
import { accountMenuItems, mainMenuItems, supportMenuItems } from "@/config/sidebar";
import { useProjects } from "@/hooks/use-projects";
import { clearStoredProjectId, getAuthToken, getStoredProjectId } from "@/lib/session";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	title?: string;
	description?: string;
	actionTab?: ReactNode;
}

const DashboardLayout = ({ children, title, description, actionTab }: Props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { listProjects } = useProjects();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [canRender, setCanRender] = useState(location.pathname === "/dashboard/projects");

	useEffect(() => {
		if (!getAuthToken()) {
			void navigate({ to: "/auth/login" });
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
	}, [location.pathname, navigate]);

	return (
		<div className="flex min-h-screen ">
			<DashboardSidebar
				mainMenuItems={mainMenuItems}
				accountMenuItems={accountMenuItems}
				supportMenuItems={supportMenuItems}
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>

			<main className=" w-full ">
				<DashboardHeader />
				<div className={"flex-1 overflow-y-auto p-6 "}>
					<div className="container">
						<PageInfo title={title} description={description} actionTab={actionTab} />
						{canRender ? children : <p className="text-sm text-gray-500">Loading project...</p>}
					</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
