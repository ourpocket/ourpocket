import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProject } from "@/hooks/use-current-project";
import { ApiError } from "@/services/api-client";
import {
	connectProjectProvider,
	listProjectProviders,
	listProviderCatalog,
} from "@/services/provider.service";
import {
	type ProjectProvider,
	ProviderCapability,
	type ProviderCatalog,
	ProviderCatalogStatus,
	ProviderCategory,
} from "@/services/types";
import { AlertCircle, LoaderCircle, Plus, Search, Settings2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

const categoryLabels: Record<ProviderCategory, string> = {
	[ProviderCategory.AFRICA]: "Africa",
	[ProviderCategory.GLOBAL]: "Global",
	[ProviderCategory.DATA_VERIFICATION]: "Data & verification",
};

const capabilityLabels: Record<ProviderCapability, string> = {
	[ProviderCapability.WALLET_OPERATIONS]: "Wallets",
	[ProviderCapability.PAYMENT_COLLECTION]: "Payments",
	[ProviderCapability.BANK_DATA]: "Bank data",
	[ProviderCapability.IDENTITY_VERIFICATION]: "Verification",
};

const catalogStatusLabels: Record<ProviderCatalogStatus, string> = {
	[ProviderCatalogStatus.DRAFT]: "Draft",
	[ProviderCatalogStatus.COMING_SOON]: "Coming soon",
	[ProviderCatalogStatus.ACTIVE]: "Available",
	[ProviderCatalogStatus.MAINTENANCE]: "Under maintenance",
	[ProviderCatalogStatus.RETIRED]: "Retired",
};

function statusClass(status: ProviderCatalogStatus): string {
	if (status === ProviderCatalogStatus.ACTIVE) {
		return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
	}

	if (status === ProviderCatalogStatus.MAINTENANCE) {
		return "border-amber-500/25 bg-amber-500/10 text-amber-200";
	}

	return "border-white/10 bg-white/5 text-zinc-400";
}

interface ProviderConnectionDialogProps {
	provider: ProviderCatalog | null;
	projectName: string;
	onClose: () => void;
	onConnected: (config: Record<string, string>) => Promise<void>;
}

function ProviderConnectionDialog({
	provider,
	projectName,
	onClose,
	onConnected,
}: ProviderConnectionDialogProps) {
	const [values, setValues] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValues({});
		setErrorMessage(null);
	}, [provider]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!provider) {
			return;
		}

		const missingField = provider.credentialFields.find(
			(field) => field.required && !values[field.key]?.trim(),
		);

		if (missingField) {
			setErrorMessage(`${missingField.label} is required.`);

			return;
		}

		setErrorMessage(null);
		setIsSubmitting(true);

		try {
			await onConnected(values);
		} catch (error) {
			setErrorMessage(
				error instanceof ApiError || error instanceof Error
					? error.message
					: "We could not connect this provider. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={Boolean(provider)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="border-white/10 bg-[#1b1b1b] text-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Connect {provider?.name}</DialogTitle>
					<DialogDescription className="leading-6 text-zinc-400">
						These credentials are encrypted and used only by {projectName}.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5">
					{provider?.credentialFields.map((field) => (
						<div key={field.key} className="space-y-2">
							<Label htmlFor={`provider-${field.key}`}>
								{field.label}
								{!field.required && <span className="text-zinc-500"> (optional)</span>}
							</Label>
							<Input
								id={`provider-${field.key}`}
								type={field.type === "secret" ? "password" : "text"}
								value={values[field.key] ?? ""}
								onChange={(event) =>
									setValues((current) => ({ ...current, [field.key]: event.target.value }))
								}
								placeholder={field.placeholder}
								disabled={isSubmitting}
							/>
						</div>
					))}

					{errorMessage && (
						<p role="alert" className="text-sm text-red-300">
							{errorMessage}
						</p>
					)}

					<DialogFooter>
						<Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
							{isSubmitting ? "Connecting…" : "Connect provider"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function WalletProvidersContent() {
	const { project, isLoading: isProjectLoading } = useCurrentProject();
	const [catalog, setCatalog] = useState<ProviderCatalog[]>([]);
	const [projectProviders, setProjectProviders] = useState<ProjectProvider[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | "all">("all");
	const [selectedProvider, setSelectedProvider] = useState<ProviderCatalog | null>(null);

	const loadProviders = useCallback(async () => {
		if (!project) {
			return;
		}

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const [catalogItems, configuredProviders] = await Promise.all([
				listProviderCatalog(),
				listProjectProviders(project.id),
			]);

			setCatalog(catalogItems);
			setProjectProviders(configuredProviders);
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "We could not load the provider catalog.",
			);
		} finally {
			setIsLoading(false);
		}
	}, [project]);

	useEffect(() => {
		void loadProviders();
	}, [loadProviders]);

	const connectedProviderIds = useMemo(
		() => new Set(projectProviders.map((provider) => provider.providerCatalogId).filter(Boolean)),
		[projectProviders],
	);

	const filteredCatalog = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return catalog.filter((provider) => {
			const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;

			const matchesSearch =
				!normalizedSearch ||
				provider.name.toLowerCase().includes(normalizedSearch) ||
				provider.description.toLowerCase().includes(normalizedSearch);

			return matchesCategory && matchesSearch;
		});
	}, [catalog, search, selectedCategory]);

	const groupedCatalog = useMemo(
		() =>
			Object.values(ProviderCategory).map((category) => ({
				category,
				providers: filteredCatalog.filter((provider) => provider.category === category),
			})),
		[filteredCatalog],
	);

	const connectProvider = async (config: Record<string, string>) => {
		if (!project || !selectedProvider) {
			return;
		}

		await connectProjectProvider(project.id, {
			providerId: selectedProvider.id,
			config,
		});
		setSelectedProvider(null);
		await loadProviders();
	};

	if (isProjectLoading) {
		return <Skeleton className="h-80 w-full" />;
	}

	if (!project) {
		return null;
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-white">Connect a provider</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
						Add a provider account to{" "}
						<span className="font-medium text-zinc-200">{project.name}</span> so your project can
						use it through the OurPocket API.
					</p>
				</div>
				<div className="relative w-full lg:max-w-sm">
					<Search
						className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
						aria-hidden="true"
					/>
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search providers"
						className="pl-9"
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2" aria-label="Provider categories">
				<Button
					type="button"
					variant={selectedCategory === "all" ? "default" : "outline"}
					onClick={() => setSelectedCategory("all")}
				>
					All providers
				</Button>
				{Object.values(ProviderCategory).map((category) => (
					<Button
						key={category}
						type="button"
						variant={selectedCategory === category ? "default" : "outline"}
						onClick={() => setSelectedCategory(category)}
					>
						{categoryLabels[category]}
					</Button>
				))}
			</div>

			{errorMessage ? (
				<div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-200">
					<AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
					<div className="space-y-3">
						<p>{errorMessage}</p>
						<Button type="button" variant="outline" onClick={() => void loadProviders()}>
							Try again
						</Button>
					</div>
				</div>
			) : isLoading ? (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }, (_, index) => (
						<Skeleton key={index} className="h-64 w-full" />
					))}
				</div>
			) : (
				<div className="space-y-10">
					{groupedCatalog.map(({ category, providers }) => {
						if (providers.length === 0) {
							return null;
						}

						return (
							<section
								key={category}
								className="space-y-4"
								aria-labelledby={`category-${category}`}
							>
								<h3 id={`category-${category}`} className="text-base font-semibold text-white">
									{categoryLabels[category]}
								</h3>
								<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
									{providers.map((provider) => {
										const isConnected = connectedProviderIds.has(provider.id);
										const canConnect = provider.status === ProviderCatalogStatus.ACTIVE;

										return (
											<article
												key={provider.id}
												className="flex min-h-64 flex-col rounded-xl border border-white/10 bg-card/70 p-5"
											>
												<div className="flex items-start justify-between gap-4">
													<img
														src={provider.logoAsset}
														alt=""
														className="size-9 rounded-md object-contain"
														onError={(event) => {
															event.currentTarget.src = "/img/provider-placeholder.svg";
														}}
													/>
													<Badge className={statusClass(provider.status)}>
														{catalogStatusLabels[provider.status]}
													</Badge>
												</div>
												<div className="mt-5">
													<h4 className="font-semibold text-white">{provider.name}</h4>
													<p className="mt-2 text-sm leading-6 text-zinc-400">
														{provider.description}
													</p>
												</div>
												<div className="mt-4 flex flex-wrap gap-2">
													{provider.capabilities.map((capability) => (
														<span key={capability} className="text-xs text-zinc-500">
															{capabilityLabels[capability]}
														</span>
													))}
												</div>
												<div className="mt-auto pt-5">
													{isConnected ? (
														<Button
															type="button"
															variant="outline"
															onClick={() => setSelectedProvider(provider)}
														>
															<Settings2 aria-hidden="true" />
															Manage connection
														</Button>
													) : (
														<Button
															type="button"
															disabled={!canConnect}
															onClick={() => setSelectedProvider(provider)}
														>
															{canConnect ? (
																<Plus aria-hidden="true" />
															) : (
																<LoaderCircle aria-hidden="true" />
															)}
															{canConnect ? "Add to project" : catalogStatusLabels[provider.status]}
														</Button>
													)}
												</div>
											</article>
										);
									})}
								</div>
							</section>
						);
					})}

					{filteredCatalog.length === 0 && (
						<div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-400">
							No providers match your search.
						</div>
					)}
				</div>
			)}

			<ProviderConnectionDialog
				provider={selectedProvider}
				projectName={project.name}
				onClose={() => setSelectedProvider(null)}
				onConnected={connectProvider}
			/>
		</div>
	);
}

function WalletProvidersPage() {
	return (
		<DashboardLayout
			title="Providers"
			description="Connect provider accounts to your active project"
		>
			<WalletProvidersContent />
		</DashboardLayout>
	);
}

export default WalletProvidersPage;
