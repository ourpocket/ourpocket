import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { setEnvironment, useEnvironment } from "@/lib/environment";
import { clearAuthToken } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";
import Avatar from "boring-avatars";
import { ArrowDown2, Notification } from "iconsax-reactjs";

const DashboardHeader = () => {
	const navigate = useNavigate();
	const environment = useEnvironment();

	const handleLogout = async () => {
		clearAuthToken();
		await navigate({ to: "/auth/login" });
	};

	return (
		<div className="bg-card w-full h-16 px-4 sm:px-[3em] flex items-center">
			<div className="container mx-auto  flex items-center justify-between">
				<h3 className="font-semibold pl-12 lg:pl-0">Dashboard</h3>

				<div className="flex items-center gap-2 sm:gap-5 ">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="bg-transparent border-red-500/20">
								<small>{environment === "sandbox" ? "Sandbox" : "Production"}</small>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setEnvironment("sandbox")}>Sandbox</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setEnvironment("production")}>
								Production
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className={"p-2 rounded-full bg-gray-600/10"}>
						<Notification variant="Bulk" />
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="flex items-center  gap-2 cursor-pointer">
								<Avatar name={"OurPocket"} size={30} colors={["#fb923c", "#27272a", "#f4f4f5"]} />

								<ArrowDown2 color={"white"} size={14} />
							</div>
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-40">
							<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default DashboardHeader;
