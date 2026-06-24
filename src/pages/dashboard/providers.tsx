import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import {
	type ProjectProvider,
	ProviderType,
	configureProjectProvider,
	listProjectProviders,
} from "@/lib/api";
import { useCurrentProject } from "@/lib/hooks/use-current-project";
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

interface ProviderConnectionFormProps {
	projectId: string;
	provider: (typeof walletProviders)[number];
	onSaved: (provider: ProjectProvider) => void;
}

const ProviderConnectionForm = ({ projectId, provider, onSaved }: ProviderConnectionFormProps) => {
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

const WalletProvidersPage = () => {
	const { project, isLoading } = useCurrentProject();
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
		</DashboardLayout>
	);
};

export default WalletProvidersPage;
