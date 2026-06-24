import DashboardHeader from "@/components/module/dashboard/header.tsx";
import PageInfo from "@/components/module/dashboard/page-info.tsx";
import DashboardSidebar from "@/components/module/dashboard/sidebar";
import { accountMenuItems, mainMenuItems, supportMenuItems } from "@/config/sidebar";
import { getAuthToken } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	title?: string;
	description?: string;
	actionTab?: ReactNode;
}

const DashboardLayout = ({ children, title, description, actionTab }: Props) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (!getAuthToken()) {
			void navigate({ to: "/auth/login" });
		}
	}, [navigate]);

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
						{children}
					</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
