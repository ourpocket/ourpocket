import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { ArrowDown2, Notification } from "iconsax-reactjs";

const DashboardHeader = () => {
	return (
		<div className="bg-card w-full h-16 flex items-center">
			<div className="container mx-auto flex items-center justify-between">
				<h3 className="invisible">Dashboard</h3>

				<div className="flex items-center gap-2">
					<div className={"flex items-center gap-2"}>
						<p className="text-xs">Test </p>
						<Switch />
						<p className="text-xs">Live</p>
					</div>
					<div>
						<Notification variant="Bulk" />
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="flex items-center  gap-2 cursor-pointer">
								<img
									width={35}
									className={"rounded-full"}
									src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Chase"
									alt="avatar"
								/>

								<ArrowDown2 color={"white"} size={14} />
							</div>
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-40">
							<DropdownMenuItem onClick={() => console.log("Logging out...")}>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default DashboardHeader;
