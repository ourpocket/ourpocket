import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Typography } from "@/components/ui/typography";
import { setEnvironment, useEnvironment } from "@/lib/environment";
import { clearAuthToken } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";
import Avatar from "boring-avatars";
import { ArrowDown2, Notification } from "iconsax-reactjs";
import { useState } from "react";

const DashboardHeader = () => {
	const navigate = useNavigate();
	const environment = useEnvironment();
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

	const handleLogout = async () => {
		setIsLogoutDialogOpen(false);
		clearAuthToken();
		await navigate({ to: "/auth/login" });
	};

	return (
		<>
			<div className="flex h-16 w-full min-w-0 items-center border-b border-white/[0.07] bg-[#171717] px-5 sm:px-10 lg:px-12 xl:px-14">
				<div className="mx-auto flex w-full min-w-0 max-w-[1440px] items-center justify-between gap-3">
					<Typography variant="label" className="min-w-0 truncate pl-12 text-white/70 lg:pl-0">
						Developer console
					</Typography>

					<div className="flex shrink-0 items-center gap-2 sm:gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="h-8 border-white/[0.09] bg-white/[0.03] px-3 text-xs text-white/75 hover:bg-white/[0.07] hover:text-white"
								>
									<span
										className={`size-1.5 rounded-full ${environment === "sandbox" ? "bg-orange-400" : "bg-emerald-400"}`}
									/>
									{environment === "sandbox" ? "Sandbox" : "Production"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => setEnvironment("sandbox")}>
									Sandbox
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setEnvironment("production")}>
									Production
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="hidden size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/60 sm:flex">
							<Notification size={17} variant="Bulk" />
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger>
								<div className="flex items-center  gap-2 cursor-pointer">
									<Avatar name={"OurPocket"} size={30} colors={["#fb923c", "#27272a", "#f4f4f5"]} />

									<ArrowDown2 color={"white"} size={14} />
								</div>
							</DropdownMenuTrigger>

							<DropdownMenuContent className="w-40">
								<DropdownMenuItem
									onSelect={() => {
										window.setTimeout(() => setIsLogoutDialogOpen(true), 0);
									}}
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			<Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
				<DialogContent className="border-white/[0.09] !bg-[#1b1b1b] text-white sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Log out of OurPocket?</DialogTitle>
						<DialogDescription className="leading-6 text-white/45">
							You will need to sign in again to access this workspace.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								className="border-white/[0.09] !bg-transparent text-white/65 hover:!bg-white/[0.05] hover:text-white"
							>
								Stay signed in
							</Button>
						</DialogClose>
						<Button type="button" onClick={() => void handleLogout()}>
							Log out
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DashboardHeader;
