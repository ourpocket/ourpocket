import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import { GenerateApiKeyModal } from "@/components/module/dashboard/api-key/generate-api-key.tsx";
import ModularModals from "@/components/module/popovers/modular-modals.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useCurrentProject } from "@/hooks/use-current-project";
import { getStoredProjectId } from "@/lib/session";
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
		<ModularModals trigger={<Button variant={"sleep"}>Generate API Key</Button>}>
			<div className={"mb-4"}>
				<h4 className={"text-lg font-semibold"}>Generate New API Key</h4>
				<small className={"text-white/70"}>Generate a project key for your application</small>
			</div>
			<GenerateApiKeyModal projectId={projectId} onGenerated={onGenerated} />
		</ModularModals>
	);
};

const scopeTitle: Record<ProjectApiKeyScope, string> = {
	[ProjectApiKeyScope.TEST]: "Test Environment",
	[ProjectApiKeyScope.LIVE]: "Production Environment",
};

async function copyText(value: string) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(value);
		return;
	}

	const textarea = document.createElement("textarea");
	textarea.value = value;
	textarea.setAttribute("readonly", "true");
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
}

const ApiKeyCard = ({
	apiKey,
	onRevoke,
	onRotate,
}: {
	apiKey: ProjectApiKey;
	onRevoke: (apiKeyId: string) => void;
	onRotate: (apiKeyId: string) => void;
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const canRevealFullKey = Boolean(apiKey.rawKey);
	const displayKey = apiKey.rawKey ?? apiKey.keyPreview ?? apiKey.id;
	const maskedKey =
		displayKey.length > 18 ? `${displayKey.slice(0, 14)}${"*".repeat(8)}` : displayKey;
	const keyText = isVisible || !canRevealFullKey ? displayKey : maskedKey;

	const handleCopy = async () => {
		try {
			await copyText(displayKey);
		} catch {
			toast.error("Could not copy API key");
			return;
		}

		if (apiKey.rawKey) {
			toast.success("API key copied");
			return;
		}

		toast.success("API key preview copied");
	};

	return (
		<ModularCard title={scopeTitle[apiKey.scope]} content={true} className={"w-full"}>
			<div className={"flex items-center justify-between"}>
				<div className={"bg-gray-700/20 p-2 rounded-md w-fit max-w-full"}>
					<p className={"text-sm break-all"}>{keyText}</p>
					<small className="text-gray-500">
						{apiKey.used ?? 0}/{apiKey.quota ?? 1000} requests
					</small>
					{!apiKey.rawKey && (
						<p className="mt-1 text-xs text-gray-500">
							Full key is shown only when it is generated.
						</p>
					)}
				</div>

				<div className={"flex gap-2 mt-2"}>
					<Copy variant={"Bulk"} size={20} className="cursor-pointer" onClick={handleCopy} />
					<button
						type="button"
						disabled={!canRevealFullKey}
						className={!canRevealFullKey ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
						onClick={() => setIsVisible((current) => !current)}
						aria-label={isVisible ? "Hide API key" : "Show API key"}
					>
						{isVisible ? (
							<EyeSlash variant={"Bulk"} size={20} />
						) : (
							<Eye variant={"Bulk"} size={20} />
						)}
					</button>
					<Button size="sm" variant="outline" onClick={() => onRotate(apiKey.id)}>
						Rotate
					</Button>
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
	const { project, environment, isLoading } = useCurrentProject();
	const { listProjectApiKeys, revokeProjectApiKey, rotateProjectApiKey } = useApiKeys();
	const [apiKeys, setApiKeys] = useState<ProjectApiKey[]>([]);

	useEffect(() => {
		let isMounted = true;
		setApiKeys([]);

		async function loadApiKeys() {
			if (!project) {
				return;
			}

			try {
				const keys = await listProjectApiKeys(project.id);
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
			title={"API Keys"}
			description={"Manage your API keys"}
			actionTab={<GenerateNewApiKey projectId={project?.id} onGenerated={handleGenerated} />}
		>
			<div className={"grid grid-cols-1 lg:grid-cols-2 w-full gap-2"}>
				{isLoading && <p className="text-sm text-gray-500">Loading keys...</p>}
				{apiKeys
					.filter(
						(key) =>
							key.scope ===
							(environment === "sandbox" ? ProjectApiKeyScope.TEST : ProjectApiKeyScope.LIVE),
					)
					.map((apiKey) => (
						<ApiKeyCard
							key={apiKey.id}
							apiKey={apiKey}
							onRevoke={handleRevoke}
							onRotate={(id) => {
								if (project)
									void rotateProjectApiKey(project.id, id)
										.then((apiKey) => {
											if (getStoredProjectId() === project.id) handleGenerated(apiKey);
										})
										.catch(() => toast.error("Could not rotate API key"));
							}}
						/>
					))}
			</div>
		</DashboardLayout>
	);
};

export default ApiKeysPage;
