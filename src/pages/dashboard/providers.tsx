import DashboardLayout from "@/components/layouts/dashboard-layout";
import { CustomModal, CustomModalCancel } from "@/components/modules/custom-modal";
import { Fallback } from "@/components/modules/fallback";
import { CardGridSkeleton, DashboardSkeleton } from "@/components/modules/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { useCurrentProject } from "@/hooks/use-current-project";
import { ApiError } from "@/services/api-client";
import {
	configureProjectProvider,
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
	type ProviderCredentialField,
} from "@/services/types";
import {
	AlertCircle,
	CheckCircle2,
	Clock3,
	Link2,
	LoaderCircle,
	Plus,
	Search,
	Settings2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

const categoryLabels: Record<ProviderCategory, string> = {
	[ProviderCategory.AFRICA]: "Africa",
	[ProviderCategory.GLOBAL]: "Global",
	[ProviderCategory.DATA_VERIFICATION]: "Data & verification",
};

const capabilityLabels: Record<ProviderCapability, string> = {
	[ProviderCapability.PAYMENTS]: "Payments",
	[ProviderCapability.REFUNDS]: "Refunds",
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

const legacyCredentialFields: ProviderCredentialField[] = [
	{
		key: "apiKey",
		label: "API key",
		type: "secret",
		required: true,
	},
];

type ProviderView = "catalog" | "connected";

type ProviderFormTarget =
	| {
			kind: "catalog";
			provider: ProviderCatalog;
			action: "connect" | "manage";
	  }
	| {
			kind: "legacy";
			connection: ProjectProvider;
			action: "manage";
	  };

function formatProviderType(type: ProjectProvider["type"]): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

function getConnectionName(connection: ProjectProvider): string {
	return connection.provider?.name ?? formatProviderType(connection.type);
}

function getConnectionLogo(connection: ProjectProvider): string {
	return connection.provider?.logoAsset ?? "/img/provider-placeholder.svg";
}

function formatConnectionDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Connection date unavailable";
	}

	return `Connected ${new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date)}`;
}

function connectionStatusClass(isActive: boolean): string {
	return isActive
		? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
		: "border-white/10 bg-white/5 text-zinc-400";
}

interface ProviderConnectionDialogProps {
	target: ProviderFormTarget | null;
	projectName: string;
	onClose: () => void;
	onSave: (target: ProviderFormTarget, config: Record<string, string>) => Promise<void>;
}

function ProviderConnectionDialog({
	target,
	projectName,
	onClose,
	onSave,
}: ProviderConnectionDialogProps) {
	const [values, setValues] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValues({});
		setErrorMessage(null);
	}, [target]);

	const providerName = target
		? target.kind === "catalog"
			? target.provider.name
			: getConnectionName(target.connection)
		: "provider";

	const credentialFields = target
		? target.kind === "catalog"
			? target.provider.credentialFields
			: legacyCredentialFields
		: [];

	const isManaging = target?.action === "manage";

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!target) {
			return;
		}

		const missingField = credentialFields.find(
			(field) => field.required && !values[field.key]?.trim(),
		);

		if (missingField) {
			setErrorMessage(`${missingField.label} is required.`);

			return;
		}

		setErrorMessage(null);
		setIsSubmitting(true);

		try {
			await onSave(target, values);
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
		<CustomModal
			open={Boolean(target)}
			onOpenChange={(open) => !open && onClose()}
			title={`${isManaging ? "Manage" : "Connect"} ${providerName}`}
			description={`These credentials are encrypted and used only by ${projectName}.`}
			contentClassName="sm:max-w-md"
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{credentialFields.map((field) => (
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

				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<CustomModalCancel disabled={isSubmitting} />
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
						{isSubmitting ? "Saving…" : isManaging ? "Save connection" : "Connect provider"}
					</Button>
				</div>
			</form>
		</CustomModal>
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
	const [activeView, setActiveView] = useState<ProviderView>("catalog");
	const [selectedTarget, setSelectedTarget] = useState<ProviderFormTarget | null>(null);

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

	const saveProviderConnection = async (
		target: ProviderFormTarget,
		config: Record<string, string>,
	) => {
		if (!project) {
			return;
		}

		if (target.kind === "legacy") {
			await configureProjectProvider(project.id, {
				type: target.connection.type,
				config,
				isActive: target.connection.isActive,
			});
		} else {
			await connectProjectProvider(project.id, {
				providerId: target.provider.id,
				config,
			});
		}

		setSelectedTarget(null);
		await loadProviders();
	};

	if (isProjectLoading) {
		return <DashboardSkeleton />;
	}

	if (!project) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div
				className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#1b1b1b] p-3 sm:flex-row sm:items-center sm:justify-between"
				role="tablist"
				aria-label="Provider views"
			>
				<div className="flex w-full rounded-lg bg-black/20 p-1 sm:w-auto">
					<Button
						type="button"
						role="tab"
						aria-selected={activeView === "catalog"}
						variant="ghost"
						className={
							activeView === "catalog"
								? "flex-1 !bg-white/[0.08] text-white sm:flex-none"
								: "flex-1 !bg-transparent text-white/45 hover:!bg-white/[0.04] hover:text-white sm:flex-none"
						}
						onClick={() => setActiveView("catalog")}
					>
						Catalog
					</Button>
					<Button
						type="button"
						role="tab"
						aria-selected={activeView === "connected"}
						variant="ghost"
						className={
							activeView === "connected"
								? "flex-1 !bg-white/[0.08] text-white sm:flex-none"
								: "flex-1 !bg-transparent text-white/45 hover:!bg-white/[0.04] hover:text-white sm:flex-none"
						}
						onClick={() => setActiveView("connected")}
					>
						Connected
						<span className="ml-1 text-xs text-white/40">{projectProviders.length}</span>
					</Button>
				</div>
				{activeView === "catalog" && (
					<div className="relative w-full sm:max-w-xs">
						<Search
							className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35"
							aria-hidden="true"
						/>
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search providers"
							className="h-9 border-white/[0.08] bg-black/15 pl-9"
						/>
					</div>
				)}
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
				<CardGridSkeleton />
			) : activeView === "connected" ? (
				projectProviders.length === 0 ? (
					<Fallback
						title="No providers connected yet"
						description="Browse the catalog to connect the provider account this project will use."
						icon={<Link2 className="size-5" aria-hidden="true" />}
						action={{ label: "Browse catalog", onClick: () => setActiveView("catalog") }}
					/>
				) : (
					<div className="divide-y divide-white/[0.07] overflow-hidden rounded-xl border border-white/[0.08] bg-[#1b1b1b]">
						{projectProviders.map((connection) => {
							const isCatalogConnection = Boolean(connection.provider);

							return (
								<article
									key={connection.id}
									className="flex flex-col gap-5 p-5 transition-colors hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between"
								>
									<div className="flex min-w-0 items-start gap-4">
										<img
											src={getConnectionLogo(connection)}
											alt=""
											className="size-10 shrink-0 rounded-md object-contain"
											onError={(event) => {
												event.currentTarget.src = "/img/provider-placeholder.svg";
											}}
										/>
										<div className="min-w-0">
											<Typography variant="subheading">{getConnectionName(connection)}</Typography>
											<Typography variant="bodySmall" className="mt-1">
												{formatConnectionDate(connection.createdAt)}
											</Typography>
											{!isCatalogConnection && (
												<Typography variant="caption" className="mt-1">
													Legacy project connection
												</Typography>
											)}
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-2 sm:justify-end">
										<Badge className={connectionStatusClass(connection.isActive)}>
											{connection.isActive ? (
												<CheckCircle2 className="mr-1 size-3" aria-hidden="true" />
											) : (
												<Clock3 className="mr-1 size-3" aria-hidden="true" />
											)}
											{connection.isActive ? "Active" : "Inactive"}
										</Badge>
										{connection.provider && (
											<Badge className={statusClass(connection.provider.status)}>
												{catalogStatusLabels[connection.provider.status]}
											</Badge>
										)}
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												setSelectedTarget(
													connection.provider
														? { kind: "catalog", provider: connection.provider, action: "manage" }
														: { kind: "legacy", connection, action: "manage" },
												)
											}
										>
											<Settings2 aria-hidden="true" />
											Manage connection
										</Button>
									</div>
								</article>
							);
						})}
					</div>
				)
			) : (
				<>
					<div className="flex flex-wrap gap-2" aria-label="Provider categories">
						<Button
							type="button"
							variant={selectedCategory === "all" ? "default" : "ghost"}
							className={
								selectedCategory === "all"
									? "h-8"
									: "h-8 border border-white/[0.08] !bg-transparent text-white/45 hover:!bg-white/[0.04] hover:text-white"
							}
							onClick={() => setSelectedCategory("all")}
						>
							All providers
						</Button>
						{Object.values(ProviderCategory).map((category) => (
							<Button
								key={category}
								type="button"
								variant={selectedCategory === category ? "default" : "ghost"}
								className={
									selectedCategory === category
										? "h-8"
										: "h-8 border border-white/[0.08] !bg-transparent text-white/45 hover:!bg-white/[0.04] hover:text-white"
								}
								onClick={() => setSelectedCategory(category)}
							>
								{categoryLabels[category]}
							</Button>
						))}
					</div>
					<div className="space-y-8">
						{groupedCatalog.map(({ category, providers }) => {
							if (providers.length === 0) {
								return null;
							}

							return (
								<section
									key={category}
									className="space-y-3"
									aria-labelledby={`category-${category}`}
								>
									<Typography
										as="h3"
										variant="label"
										id={`category-${category}`}
										className="uppercase tracking-[0.08em] text-white/45"
									>
										{categoryLabels[category]}
									</Typography>
									<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
										{providers.map((provider) => {
											const isConnected = connectedProviderIds.has(provider.id);
											const canConnect = provider.status === ProviderCatalogStatus.ACTIVE;

											return (
												<article
													key={provider.id}
													className="group flex min-h-56 flex-col rounded-xl border border-white/[0.08] bg-[#1b1b1b] p-5 transition-colors hover:border-white/[0.14] hover:bg-[#1d1d1d]"
												>
													<div className="flex items-start justify-between gap-4">
														<img
															src={provider.logoAsset}
															alt=""
															className="size-11 rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 object-contain"
															onError={(event) => {
																event.currentTarget.src = "/img/provider-placeholder.svg";
															}}
														/>
														<Badge className={statusClass(provider.status)}>
															{catalogStatusLabels[provider.status]}
														</Badge>
													</div>
													<div className="mt-4">
														<Typography variant="heading">{provider.name}</Typography>
														<Typography className="mt-1.5 line-clamp-2">
															{provider.description}
														</Typography>
													</div>
													<div className="mt-4 flex flex-wrap gap-1.5">
														{provider.capabilities.map((capability) => (
															<Typography
																key={capability}
																variant="caption"
																className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-white/45"
															>
																{capabilityLabels[capability]}
															</Typography>
														))}
													</div>
													<div className="mt-auto pt-5">
														{isConnected ? (
															<Button
																type="button"
																variant="outline"
																onClick={() =>
																	setSelectedTarget({ kind: "catalog", provider, action: "manage" })
																}
															>
																<Settings2 aria-hidden="true" />
																Manage connection
															</Button>
														) : (
															<Button
																type="button"
																disabled={!canConnect}
																onClick={() =>
																	setSelectedTarget({
																		kind: "catalog",
																		provider,
																		action: "connect",
																	})
																}
															>
																{canConnect ? (
																	<Plus aria-hidden="true" />
																) : (
																	<Clock3 aria-hidden="true" />
																)}
																{canConnect
																	? "Add to project"
																	: catalogStatusLabels[provider.status]}
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
							<Fallback
								title="No matching providers"
								description="Try another search term or select a different category."
							/>
						)}
					</div>
				</>
			)}

			<ProviderConnectionDialog
				target={selectedTarget}
				projectName={project.name}
				onClose={() => setSelectedTarget(null)}
				onSave={saveProviderConnection}
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
