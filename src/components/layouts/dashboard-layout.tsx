import DashboardHeader from "@/components/module/dashboard/header.tsx";
import DashboardSidebar from "@/components/module/dashboard/sidebar";
import { accountMenuItems, mainMenuItems, supportMenuItems } from "@/config/sidebar";
import { useState } from "react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="flex min-h-screen bg-background">
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
					<div className="container">{children}</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
