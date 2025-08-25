import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import { GenerateApiKeyModal } from "@/components/module/dashboard/api-key/generate-api-key.tsx";
import ModularModals from "@/components/module/popovers/modular-modals.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Copy, Eye, EyeSlash, Trash } from "iconsax-reactjs";
import { useState } from "react";

const GenerateNewApiKey = () => {
	return (
		<ModularModals trigger={<Button variant={"sleep"}>Generate Api Key 🔑</Button>}>
			<div className={"mb-4"}>
				<h4 className={"text-lg font-semibold"}>Generate new Api Key</h4>
				<small className={"text-white/70"}>Generate new key for your Application</small>
			</div>
			<GenerateApiKeyModal />
		</ModularModals>
	);
};

const ApiKeyCard = ({ title, apiKey }: { title: string; apiKey: string }) => {
	const [isVisible, setIsVisible] = useState(false);

	const maskedKey = apiKey.slice(0, 10) + "*********";

	const handleCopy = () => {
		navigator.clipboard.writeText(apiKey);
	};

	return (
		<ModularCard title={title} content={true} className={"w-full"}>
			<div className={"flex items-center justify-between"}>
				<div className={"bg-gray-700/20 p-2 rounded-md w-fit"}>
					<p className={"text-sm"}>{isVisible ? apiKey : maskedKey}</p>
				</div>

				<div className={"flex gap-2 mt-2"}>
					<Copy variant={"Bulk"} size={20} className="cursor-pointer" onClick={handleCopy} />
					{isVisible ? (
						<EyeSlash
							variant={"Bulk"}
							size={20}
							className="cursor-pointer"
							onClick={() => setIsVisible(false)}
						/>
					) : (
						<Eye
							variant={"Bulk"}
							size={20}
							className="cursor-pointer"
							onClick={() => setIsVisible(true)}
						/>
					)}
					<Trash variant={"Bulk"} size={20} className="cursor-pointer" />
				</div>
			</div>
		</ModularCard>
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
				<ApiKeyCard title="Test Environment" apiKey="pk_live_51H7ABCDEFGHIJ123456789" />
				<ApiKeyCard title="Production Environment" apiKey="pk_prod_98X7ZYXWVUTSRQPONMLK" />
			</div>
		</DashboardLayout>
	);
};

export default ApiKeysPage;
