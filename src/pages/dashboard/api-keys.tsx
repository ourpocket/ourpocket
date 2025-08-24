import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardTitle } from "@/components/ui/card.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Eye, EyeSlash } from "iconsax-reactjs";

const GenerateNewApiKey = () => {
	return (
		<>
			<Dialog>
				<DialogTrigger>
					<Button variant={"sleep"}>Generate Api Key 🔑</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle></DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};

const ApiKeysPage = () => {
	return (
		<DashboardLayout
			title={"Api Key"}
			description={"Manage your API keys"}
			actionTab={<GenerateNewApiKey />}
		>
			<div className={"flex items-center w-full gap-2"}>
				<ModularCard title={"Test Environment"} content={true} className={"w-full"}>
					<div className={"flex items-center justify-between"}>
						<div className={"bg-gray-700/20 p-2 rounded-md w-fit"}>
							<p className={"text-sm"}>pk_live_51H7*********</p>
						</div>

						<div className={"flex gap-2 mt-2"}>
							<Copy variant={"Bulk"} size={20} />
							<Eye variant={"Bulk"} size={20} />
							<EyeSlash variant={"Bulk"} size={20} />
						</div>
					</div>
				</ModularCard>

				<ModularCard title={"Test Environment"} content={true} className={"w-full"}>
					<div className={"flex items-center justify-between"}>
						<div className={"bg-gray-700/20 p-2 rounded-md w-fit"}>
							<p className={"text-sm"}>pk_live_51H7*********</p>
						</div>

						<div className={"flex gap-2 mt-2"}>
							<Copy variant={"Bulk"} size={20} />
							<Eye variant={"Bulk"} size={20} />
							<EyeSlash variant={"Bulk"} size={20} />
						</div>
					</div>
				</ModularCard>
			</div>
		</DashboardLayout>
	);
};

export default ApiKeysPage;
