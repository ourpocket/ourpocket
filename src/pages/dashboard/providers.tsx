import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentProject } from "@/hooks/use-current-project";
import { useProviders } from "@/hooks/use-providers";
import { useUserProviders } from "@/hooks/use-user-providers";
import {
	type LegacyWalletProvider,
	type ProjectProvider,
	ProviderType,
	type UserProvider,
	WalletProviderAction,
} from "@/services/types";
import { Add } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

const walletProviders = [
	{
		type: ProviderType.PAYSTACK,
		name: "Paystack",
		description:
			"A leading payment gateway enabling businesses to accept payments via card, bank transfers, and mobile wallets. Acquired by Stripe.",
		logo: "/img/paystack_logo.svg",
		status: "active",
	},
	{
		type: ProviderType.FLUTTERWAVE,
		name: "Flutterwave",
		description:
			"Pan-African payment infrastructure provider that enables global merchants and payment service providers to process payments across Africa.",
		logo: "/img/flutterwave_logo.svg",
		status: "active",
	},
	{
		type: ProviderType.PAGA,
		name: "Paga",
		description:
			"Business banking and payments platform offering tools for payments, loans, and business management.",
		logo: "/img/paga_logo.svg",
		status: "active",
	},

	{
		type: ProviderType.FINGRA,
		name: "Fingra",
		description:
			"Business banking and payments platform offering tools for payments, loans, and business management.",
		logo: "/img/paga_logo.svg",
		status: "active",
	},
];

const providerOptions = Object.values(ProviderType);
const walletProviderActionOptions = Object.values(WalletProviderAction);

function parseJsonObject(value: string) {
	if (!value.trim()) {
		return {};
	}

	return JSON.parse(value) as Record<string, unknown>;
}

interface ProviderConnectionFormProps {
	projectId: string;
	provider: (typeof walletProviders)[number];
	onSaved: (provider: ProjectProvider) => void;
}

const ProviderConnectionForm = ({ projectId, provider, onSaved }: ProviderConnectionFormProps) => {
	const { configureProjectProvider } = useProviders();
	const [apiKey, setApiKey] = useState("");
	const [successRate, setSuccessRate] = useState("99");
	const [feePercentage, setFeePercentage] = useState("1.5");
	const [settlementMinutes, setSettlementMinutes] = useState("60");
	const [priority, setPriority] = useState("1");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const savedProvider = await configureProjectProvider(projectId, {
				type: provider.type,
				isActive: true,
				config: {
					apiKey,
					successRate: Number(successRate),
					feePercentage: Number(feePercentage),
					settlementMinutes: Number(settlementMinutes),
					priority: Number(priority),
				},
			});
			onSaved(savedProvider);
			toast.success(`${provider.name} connected`);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not connect provider";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Input
				value={apiKey}
				onChange={(event) => setApiKey(event.target.value)}
				placeholder={`${provider.name} secret key`}
				required
			/>
			<div className="grid grid-cols-2 gap-3">
				<Input
					value={successRate}
					onChange={(event) => setSuccessRate(event.target.value)}
					placeholder="Success rate"
					type="number"
					min="0"
					max="100"
				/>
				<Input
					value={feePercentage}
					onChange={(event) => setFeePercentage(event.target.value)}
					placeholder="Fee %"
					type="number"
					min="0"
					step="0.01"
				/>
				<Input
					value={settlementMinutes}
					onChange={(event) => setSettlementMinutes(event.target.value)}
					placeholder="Settlement minutes"
					type="number"
					min="0"
				/>
				<Input
					value={priority}
					onChange={(event) => setPriority(event.target.value)}
					placeholder="Priority"
					type="number"
					min="1"
				/>
			</div>
			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Saving..." : "Save Provider"}
			</Button>
		</form>
	);
};

const ProviderCatalogManager = () => {
	const { addWalletProvider, isLoading, listWalletProvidersCatalog, removeWalletProvider } =
		useProviders();
	const [providers, setProviders] = useState<LegacyWalletProvider[]>([]);
	const [type, setType] = useState<ProviderType>(ProviderType.PAYSTACK);
	const [config, setConfig] = useState('{"apiKey":""}');

	useEffect(() => {
		let isMounted = true;

		async function loadCatalog() {
			try {
				const catalog = await listWalletProvidersCatalog();
				if (isMounted) {
					setProviders(catalog);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load provider catalog";
				toast.error(message);
			}
		}

		void loadCatalog();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const savedProvider = await addWalletProvider({
				type,
				config: parseJsonObject(config),
			});
			setProviders((current) => [
				savedProvider,
				...current.filter((provider) => provider.type !== savedProvider.type),
			]);
			toast.success("Wallet provider catalog updated");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Provider config must be valid JSON";
			toast.error(message);
		}
	};

	const handleRemove = async (providerType: ProviderType) => {
		try {
			await removeWalletProvider(providerType);
			setProviders((current) => current.filter((provider) => provider.type !== providerType));
			toast.success("Wallet provider removed");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not remove wallet provider";
			toast.error(message);
		}
	};

	return (
		<ModularCard title="Provider Catalog" content>
			<div className="space-y-4">
				<form onSubmit={handleAdd} className="space-y-3">
					<Select value={type} onValueChange={(value) => setType(value as ProviderType)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Provider" />
						</SelectTrigger>
						<SelectContent>
							{providerOptions.map((provider) => (
								<SelectItem key={provider} value={provider}>
									{provider}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Textarea
						value={config}
						onChange={(event) => setConfig(event.target.value)}
						placeholder="Provider config JSON"
					/>
					<Button type="submit" disabled={isLoading}>
						Save Catalog Provider
					</Button>
				</form>

				<div className="space-y-2">
					{providers.map((provider) => (
						<div
							key={provider.type}
							className="flex items-center justify-between rounded-md bg-gray-700/20 p-3 text-sm"
						>
							<div>
								<p className="font-medium">{provider.name}</p>
								<p className="text-gray-400">{provider.type}</p>
							</div>
							<Button className="bg-gray-700/20" onClick={() => handleRemove(provider.type)}>
								Remove
							</Button>
						</div>
					))}
				</div>
			</div>
		</ModularCard>
	);
};

const UserProviderManager = () => {
	const {
		createUserProvider,
		deleteUserProvider,
		isLoading,
		listUserProviders,
		toggleUserProvider,
		updateUserProvider,
	} = useUserProviders();
	const [providers, setProviders] = useState<UserProvider[]>([]);
	const [type, setType] = useState<ProviderType>(ProviderType.PAYSTACK);
	const [name, setName] = useState("Paystack");
	const [config, setConfig] = useState('{"apiKey":""}');

	useEffect(() => {
		let isMounted = true;

		async function loadUserProviders() {
			try {
				const items = await listUserProviders();
				if (isMounted) {
					setProviders(items);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load user providers";
				toast.error(message);
			}
		}

		void loadUserProviders();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const provider = await createUserProvider({
				type,
				name,
				config: parseJsonObject(config),
				isActive: true,
			});
			setProviders((current) => [
				provider,
				...current.filter((item) => item.id !== provider.id && item.type !== provider.type),
			]);
			toast.success("User provider saved");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Provider config must be valid JSON";
			toast.error(message);
		}
	};

	const handleUpdate = async (providerId: string) => {
		try {
			const provider = await updateUserProvider(providerId, {
				name,
				config: parseJsonObject(config),
			});
			setProviders((current) => current.map((item) => (item.id === provider.id ? provider : item)));
			toast.success("User provider updated");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Provider config must be valid JSON";
			toast.error(message);
		}
	};

	const handleToggle = async (providerId: string) => {
		const provider = await toggleUserProvider(providerId);
		setProviders((current) => current.map((item) => (item.id === provider.id ? provider : item)));
	};

	const handleDelete = async (providerId: string) => {
		await deleteUserProvider(providerId);
		setProviders((current) => current.filter((provider) => provider.id !== providerId));
		toast.success("User provider deleted");
	};

	return (
		<ModularCard title="User Provider Vault" content>
			<div className="space-y-4">
				<form onSubmit={handleCreate} className="space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Select
							value={type}
							onValueChange={(value) => {
								setType(value as ProviderType);
								setName(value);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Provider" />
							</SelectTrigger>
							<SelectContent>
								{providerOptions.map((provider) => (
									<SelectItem key={provider} value={provider}>
										{provider}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Provider name"
							required
						/>
					</div>
					<Textarea
						value={config}
						onChange={(event) => setConfig(event.target.value)}
						placeholder="Provider config JSON"
					/>
					<Button type="submit" disabled={isLoading}>
						Save User Provider
					</Button>
				</form>

				<div className="space-y-2">
					{providers.map((provider) => (
						<div key={provider.id} className="rounded-md bg-gray-700/20 p-3 text-sm">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="font-medium">{provider.name}</p>
									<p className="text-gray-400">
										{provider.type} · {provider.isActive ? "active" : "inactive"}
									</p>
								</div>
								<div className="flex gap-2">
									<Button className="bg-gray-700/20" onClick={() => handleUpdate(provider.id)}>
										Update
									</Button>
									<Button className="bg-gray-700/20" onClick={() => handleToggle(provider.id)}>
										Toggle
									</Button>
									<Button className="bg-gray-700/20" onClick={() => handleDelete(provider.id)}>
										Delete
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</ModularCard>
	);
};

const ProviderActionConsole = () => {
	const { createWalletWithProvider, isLoading, runWalletProviderAction } = useProviders();
	const [projectApiKey, setProjectApiKey] = useState("");
	const [provider, setProvider] = useState<ProviderType>(ProviderType.PAYSTACK);
	const [action, setAction] = useState<WalletProviderAction>(WalletProviderAction.CREATE_WALLET);
	const [payload, setPayload] = useState("{}");
	const [result, setResult] = useState<unknown>(null);

	const requireApiKey = () => {
		if (!projectApiKey.trim()) {
			toast.error("Project API key is required");
			return null;
		}

		return projectApiKey.trim();
	};

	const handleCreateWallet = async () => {
		const apiKey = requireApiKey();
		if (!apiKey) return;

		try {
			const response = await createWalletWithProvider(apiKey, {
				provider,
				payload: parseJsonObject(payload),
			});
			setResult(response);
			toast.success("Provider wallet request submitted");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Payload must be valid JSON";
			toast.error(message);
		}
	};

	const handleRunAction = async () => {
		const apiKey = requireApiKey();
		if (!apiKey) return;

		try {
			const response = await runWalletProviderAction(apiKey, {
				provider,
				action,
				payload: parseJsonObject(payload),
			});
			setResult(response);
			toast.success("Provider action submitted");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Payload must be valid JSON";
			toast.error(message);
		}
	};

	return (
		<ModularCard title="Provider Action Console" content>
			<div className="space-y-3">
				<Input
					value={projectApiKey}
					onChange={(event) => setProjectApiKey(event.target.value)}
					placeholder="Project API key"
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<Select value={provider} onValueChange={(value) => setProvider(value as ProviderType)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Provider" />
						</SelectTrigger>
						<SelectContent>
							{providerOptions.map((item) => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={action}
						onValueChange={(value) => setAction(value as WalletProviderAction)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Action" />
						</SelectTrigger>
						<SelectContent>
							{walletProviderActionOptions.map((item) => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Textarea
					value={payload}
					onChange={(event) => setPayload(event.target.value)}
					placeholder="Provider payload JSON"
				/>
				<div className="flex flex-wrap gap-2">
					<Button type="button" disabled={isLoading} onClick={handleCreateWallet}>
						Create Wallet
					</Button>
					<Button
						type="button"
						className="bg-gray-700/20"
						disabled={isLoading}
						onClick={handleRunAction}
					>
						Run Action
					</Button>
				</div>
				<pre className="max-h-[260px] overflow-auto rounded-md bg-black/30 p-3 text-xs text-gray-200">
					{result ? JSON.stringify(result, null, 2) : "Run a provider request to see the response."}
				</pre>
			</div>
		</ModularCard>
	);
};

const WalletProvidersPage = () => {
	const { project, isLoading } = useCurrentProject();
	const { listProjectProviders } = useProviders();
	const [configuredProviders, setConfiguredProviders] = useState<ProjectProvider[]>([]);

	useEffect(() => {
		let isMounted = true;

		async function loadProviders() {
			if (!project) {
				return;
			}

			try {
				const providers = await listProjectProviders(project.id);
				if (isMounted) {
					setConfiguredProviders(providers);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load providers";
				toast.error(message);
			}
		}

		void loadProviders();

		return () => {
			isMounted = false;
		};
	}, [project]);

	const handleSaved = (provider: ProjectProvider) => {
		setConfiguredProviders((current) => [
			provider,
			...current.filter((item) => item.type !== provider.type),
		]);
	};

	return (
		<DashboardLayout title="Wallet Providers" description="Manage your wallet providers">
			{isLoading && <p className="mb-4 text-sm text-gray-500">Loading providers...</p>}
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{walletProviders.map((provider) => {
						const configuredProvider = configuredProviders.find(
							(item) => item.type === provider.type,
						);
						const status = configuredProvider?.isActive ? "active" : "not connected";

						return (
							<ModularCard key={provider.name} content={true}>
								<div className={"flex items-center justify-between"}>
									<div className="flex-col items-center gap-3">
										<img src={provider.logo} alt={provider.name} width={30} />
										<h3 className={"mt-2"}>{provider.name}</h3>
									</div>

									<span className="text-xs text-green-600">{status}</span>
								</div>
								<div className={"text-sm text-gray-400 mt-2"}>{provider.description}</div>

								<ModularModals
									trigger={
										<Button
											className={"mt-4 bg-gray-700/20 hover:bg-gray-700/30"}
											disabled={!project}
										>
											<Add variant={"Bulk"} size={20} />
											{configuredProvider ? "Update Provider" : "Add Wallet Provider"}
										</Button>
									}
								>
									{project && (
										<ProviderConnectionForm
											projectId={project.id}
											provider={provider}
											onSaved={handleSaved}
										/>
									)}
								</ModularModals>
							</ModularCard>
						);
					})}
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<ProviderCatalogManager />
					<UserProviderManager />
					<ProviderActionConsole />
				</div>
			</div>
		</DashboardLayout>
	);
};

export default WalletProvidersPage;
