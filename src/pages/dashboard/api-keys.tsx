import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import { GenerateApiKeyModal } from "@/components/module/dashboard/api-key/generate-api-key.tsx";
import ModularModals from "@/components/module/popovers/modular-modals.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useCurrentProject } from "@/hooks/use-current-project";
import { type ProjectApiKey, ProjectApiKeyScope } from "@/services/types";
import { Copy, Eye, EyeSlash, Trash } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GenerateNewApiKeyProps {
	projectId?: string;
	onGenerated: (apiKey: ProjectApiKey) => void;
}

const GenerateNewApiKey = ({ projectId, onGenerated }: GenerateNewApiKeyProps) => {
	if (!projectId) {
		return null;
	}

	return (
		<ModularModals trigger={<Button variant={"sleep"}>Generate Api Key 🔑</Button>}>
			<div className={"mb-4"}>
				<h4 className={"text-lg font-semibold"}>Generate new Api Key</h4>
				<small className={"text-white/70"}>Generate new key for your Application</small>
			</div>
			<GenerateApiKeyModal projectId={projectId} onGenerated={onGenerated} />
		</ModularModals>
	);
};

const scopeTitle: Record<ProjectApiKeyScope, string> = {
	[ProjectApiKeyScope.TEST]: "Test Environment",
	[ProjectApiKeyScope.LIVE]: "Production Environment",
};

const ApiKeyCard = ({
	apiKey,
	onRevoke,
}: {
	apiKey: ProjectApiKey;
	onRevoke: (apiKeyId: string) => void;
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const visibleKey = apiKey.rawKey || apiKey.keyPreview || apiKey.id;
	const maskedKey = visibleKey.length > 18 ? `${visibleKey.slice(0, 14)}********` : visibleKey;

	const handleCopy = async () => {
		if (!apiKey.rawKey) {
			toast.info("Only newly generated keys can be copied.");
			return;
		}

		await navigator.clipboard.writeText(apiKey.rawKey);
		toast.success("API key copied");
	};

	return (
		<ModularCard title={scopeTitle[apiKey.scope]} content={true} className={"w-full"}>
			<div className={"flex items-center justify-between"}>
				<div className={"bg-gray-700/20 p-2 rounded-md w-fit"}>
					<p className={"text-sm"}>{isVisible ? visibleKey : maskedKey}</p>
					<small className="text-gray-500">
						{apiKey.used ?? 0}/{apiKey.quota ?? 1000} requests
					</small>
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
					<Trash
						variant={"Bulk"}
						size={20}
						className="cursor-pointer"
						onClick={() => onRevoke(apiKey.id)}
					/>
				</div>
			</div>
		</ModularCard>
	);
};

const ApiKeysPage = () => {
	const { project, isLoading } = useCurrentProject();
	const { ensureDefaultApiKeys, revokeProjectApiKey } = useApiKeys();
	const [apiKeys, setApiKeys] = useState<ProjectApiKey[]>([]);

	useEffect(() => {
		let isMounted = true;

		async function loadApiKeys() {
			if (!project) {
				return;
			}

			try {
				const keys = await ensureDefaultApiKeys(project.id);
				if (isMounted) {
					setApiKeys(keys);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load API keys";
				toast.error(message);
			}
		}

		void loadApiKeys();

		return () => {
			isMounted = false;
		};
	}, [project]);

	const handleGenerated = (apiKey: ProjectApiKey) => {
		setApiKeys((current) => [apiKey, ...current.filter((key) => key.scope !== apiKey.scope)]);
	};

	const handleRevoke = async (apiKeyId: string) => {
		if (!project) {
			return;
		}

		try {
			await revokeProjectApiKey(project.id, apiKeyId);
			setApiKeys((current) => current.filter((key) => key.id !== apiKeyId));
			toast.success("API key revoked");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not revoke API key";
			toast.error(message);
		}
	};

	return (
		<DashboardLayout
			title={"Api Key"}
			description={"Manage your API keys"}
			actionTab={<GenerateNewApiKey projectId={project?.id} onGenerated={handleGenerated} />}
		>
			<div className={"grid grid-cols-1 lg:grid-cols-2 w-full gap-2"}>
				{isLoading && <p className="text-sm text-gray-500">Loading keys...</p>}
				{apiKeys.map((apiKey) => (
					<ApiKeyCard key={apiKey.id} apiKey={apiKey} onRevoke={handleRevoke} />
				))}
			</div>
		</DashboardLayout>
	);
};

export default ApiKeysPage;
