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
		<Dialog open={Boolean(target)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="border-white/10 bg-[#1b1b1b] text-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isManaging ? "Manage" : "Connect"} {providerName}
					</DialogTitle>
					<DialogDescription className="leading-6 text-zinc-400">
						These credentials are encrypted and used only by {projectName}.
					</DialogDescription>
				</DialogHeader>

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

					<DialogFooter>
						<Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
							{isSubmitting ? "Saving…" : isManaging ? "Save connection" : "Connect provider"}
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
		return <Skeleton className="h-80 w-full" />;
	}

	if (!project) {
		return null;
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-white">
						{activeView === "catalog" ? "Connect a provider" : "Connected providers"}
					</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
						{activeView === "catalog" ? (
							<>
								Add a provider account to{" "}
								<span className="font-medium text-zinc-200">{project.name}</span> so your project
								can use it through the OurPocket API.
							</>
						) : (
							<>
								Review and update provider accounts connected to{" "}
								<span className="font-medium text-zinc-200">{project.name}</span>.
							</>
						)}
					</p>
				</div>
				{activeView === "catalog" && (
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
				)}
			</div>

			<div
				className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
				role="tablist"
				aria-label="Provider views"
			>
				<Button
					type="button"
					role="tab"
					aria-selected={activeView === "catalog"}
					variant={activeView === "catalog" ? "default" : "outline"}
					onClick={() => setActiveView("catalog")}
				>
					Catalog
				</Button>
				<Button
					type="button"
					role="tab"
					aria-selected={activeView === "connected"}
					variant={activeView === "connected" ? "default" : "outline"}
					onClick={() => setActiveView("connected")}
				>
					Connected
					{projectProviders.length > 0 && (
						<span className="ml-1 text-xs">{projectProviders.length}</span>
					)}
				</Button>
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
			) : activeView === "connected" ? (
				projectProviders.length === 0 ? (
					<div className="rounded-xl border border-dashed border-white/15 px-6 py-12 text-center">
						<Link2 className="mx-auto size-6 text-zinc-500" aria-hidden="true" />
						<h3 className="mt-4 font-semibold text-white">No providers connected yet</h3>
						<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
							Browse the catalog to connect the provider account this project will use.
						</p>
						<Button type="button" className="mt-5" onClick={() => setActiveView("catalog")}>
							Browse catalog
						</Button>
					</div>
				) : (
					<div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-card/70">
						{projectProviders.map((connection) => {
							const isCatalogConnection = Boolean(connection.provider);

							return (
								<article
									key={connection.id}
									className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
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
											<h3 className="font-semibold text-white">{getConnectionName(connection)}</h3>
											<p className="mt-1 text-sm text-zinc-400">
												{formatConnectionDate(connection.createdAt)}
											</p>
											{!isCatalogConnection && (
												<p className="mt-1 text-xs text-zinc-500">Legacy project connection</p>
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
							<div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-400">
								No providers match your search.
							</div>
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
