import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Avatar from "boring-avatars";
import { ArrowDown2, Notification } from "iconsax-reactjs";

const DashboardHeader = () => {
	return (
		<div className="bg-card w-full h-16 px-[3em] flex items-center">
			<div className="container mx-auto  flex items-center justify-between">
				<h3 className="font-semibold">Dashboard</h3>

				<div className="flex items-center gap-5 ">
					<Button
						variant={"outline"}
						className={
							"bg-transparent font-semibold hover:bg-[var(--default)]" +
							" border-red-500/20 hover:text-white"
						}
						onClick={() => console.log("Test Mode")}
					>
						<div className={"bg-red-500 w-2 h-2 rounded-full mr-2"} />
						<small>Test Mode</small>
					</Button>
					<div>
						<Notification variant="Bulk" />
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="flex items-center  gap-2 cursor-pointer">
								<Avatar name={"Emmanuel Obiabo"} size={30} />

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
