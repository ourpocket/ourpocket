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
		<div className="flex min-h-screen">
			<DashboardSidebar
				mainMenuItems={mainMenuItems}
				accountMenuItems={accountMenuItems}
				supportMenuItems={supportMenuItems}
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>

			{/* Main content */}
			<main className="flex-1 overflow-y-auto p-6 lg:pl-64">
				<div className="mx-auto max-w-7xl">{children}</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
