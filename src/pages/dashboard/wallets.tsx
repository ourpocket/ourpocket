import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWallets } from "@/hooks/use-wallets";
import { ProviderType, RoutingStrategy } from "@/services/types";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { toast } from "sonner";

const providerOptions = Object.values(ProviderType);
const routingOptions = Object.values(RoutingStrategy);

const blankWalletAction = {
	walletId: "",
	amount: "",
	currency: "NGN",
	reference: "",
	provider: "none",
	routingStrategy: "none",
	providerPriority: "",
	providerPayload: "{}",
};

function ResultPanel({ result }: { result: unknown }) {
	return (
		<ModularCard title="Response" content className="w-full">
			<pre className="max-h-[420px] overflow-auto rounded-md bg-black/30 p-4 text-xs text-gray-200">
				{result ? JSON.stringify(result, null, 2) : "Run a wallet operation to see the response."}
			</pre>
		</ModularCard>
	);
}

function OperationCard({ title, children }: { title: string; children: ReactNode }) {
	return (
		<ModularCard title={title} content className="w-full">
			{children}
		</ModularCard>
	);
}

function resolveProvider(value: string) {
	return value === "none" ? undefined : (value as ProviderType);
}

function resolveRoutingStrategy(value: string) {
	return value === "none" ? undefined : (value as RoutingStrategy);
}

function resolveProviderPriority(value: string) {
	const providers = value
		.split(",")
		.map((provider) => provider.trim())
		.filter(Boolean) as ProviderType[];

	return providers.length > 0 ? providers : undefined;
}

function parseJsonObject(value: string) {
	if (!value.trim()) {
		return undefined;
	}

	return JSON.parse(value) as Record<string, unknown>;
}

const WalletsPage = () => {
	const { createWallet, creditWallet, debitWallet, getWallet, isLoading, transferWallet } =
		useWallets();
	const [projectApiKey, setProjectApiKey] = useState("");
	const [result, setResult] = useState<unknown>(null);
	const [createPayload, setCreatePayload] = useState({
		currency: "NGN",
		accountId: "",
	});
	const [lookupWalletId, setLookupWalletId] = useState("");
	const [creditPayload, setCreditPayload] = useState(blankWalletAction);
	const [debitPayload, setDebitPayload] = useState(blankWalletAction);
	const [transferPayload, setTransferPayload] = useState({
		fromWalletId: "",
		toWalletId: "",
		amount: "",
		currency: "NGN",
		reference: "",
	});

	const requireApiKey = () => {
		if (!projectApiKey.trim()) {
			toast.error("Project API key is required");
			return null;
		}

		return projectApiKey.trim();
	};

	const handleCreateWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const apiKey = requireApiKey();
		if (!apiKey) return;

		const response = await createWallet(apiKey, {
			currency: createPayload.currency,
			accountId: createPayload.accountId || undefined,
		});
		setResult(response);
		toast.success("Wallet created");
	};

	const handleLookupWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const apiKey = requireApiKey();
		if (!apiKey) return;

		const response = await getWallet(apiKey, lookupWalletId);
		setResult(response);
	};

	const handleWalletLedgerAction =
		(type: "credit" | "debit") => async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const apiKey = requireApiKey();
			if (!apiKey) return;

			const payload = type === "credit" ? creditPayload : debitPayload;
			const action = type === "credit" ? creditWallet : debitWallet;
			let providerPayload: Record<string, unknown> | undefined;

			try {
				providerPayload = parseJsonObject(payload.providerPayload);
			} catch {
				toast.error("Provider payload must be valid JSON");
				return;
			}

			const response = await action(apiKey, {
				walletId: payload.walletId,
				amount: payload.amount,
				currency: payload.currency,
				reference: payload.reference,
				provider: resolveProvider(payload.provider),
				routingStrategy: resolveRoutingStrategy(payload.routingStrategy),
				providerPriority: resolveProviderPriority(payload.providerPriority),
				providerPayload,
			});
			setResult(response);
			toast.success(type === "credit" ? "Wallet credited" : "Wallet debited");
		};

	const handleTransfer = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const apiKey = requireApiKey();
		if (!apiKey) return;

		const response = await transferWallet(apiKey, transferPayload);
		setResult(response);
		toast.success("Wallet transfer submitted");
	};

	const renderLedgerFields = (
		payload: typeof blankWalletAction,
		onChange: (payload: typeof blankWalletAction) => void,
	) => (
		<div className="grid grid-cols-1 gap-3">
			<Input
				value={payload.walletId}
				onChange={(event) => onChange({ ...payload, walletId: event.target.value })}
				placeholder="Wallet ID"
				required
			/>
			<div className="grid grid-cols-2 gap-3">
				<Input
					value={payload.amount}
					onChange={(event) => onChange({ ...payload, amount: event.target.value })}
					placeholder="Amount"
					required
				/>
				<Input
					value={payload.currency}
					onChange={(event) => onChange({ ...payload, currency: event.target.value.toUpperCase() })}
					placeholder="Currency"
					required
				/>
			</div>
			<Input
				value={payload.reference}
				onChange={(event) => onChange({ ...payload, reference: event.target.value })}
				placeholder="Reference"
				required
			/>
			<div className="grid grid-cols-2 gap-3">
				<Select
					value={payload.provider}
					onValueChange={(provider) => onChange({ ...payload, provider })}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Provider" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No provider</SelectItem>
						{providerOptions.map((provider) => (
							<SelectItem key={provider} value={provider}>
								{provider}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={payload.routingStrategy}
					onValueChange={(routingStrategy) => onChange({ ...payload, routingStrategy })}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Routing" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No routing</SelectItem>
						{routingOptions.map((strategy) => (
							<SelectItem key={strategy} value={strategy}>
								{strategy}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Input
				value={payload.providerPriority}
				onChange={(event) => onChange({ ...payload, providerPriority: event.target.value })}
				placeholder="Provider priority CSV, e.g. paystack,flutterwave"
			/>
			<Textarea
				value={payload.providerPayload}
				onChange={(event) => onChange({ ...payload, providerPayload: event.target.value })}
				placeholder="Provider payload JSON"
			/>
		</div>
	);

	return (
		<DashboardLayout title="Wallets" description="Create wallets and execute wallet operations">
			<div className="grid grid-cols-1 gap-6">
				<ModularCard title="Project API Key" content>
					<Input
						value={projectApiKey}
						onChange={(event) => setProjectApiKey(event.target.value)}
						placeholder="op_test_sk_... or op_live_sk_..."
					/>
				</ModularCard>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="grid grid-cols-1 gap-6">
						<OperationCard title="Create Wallet">
							<form onSubmit={handleCreateWallet} className="space-y-3">
								<Input
									value={createPayload.currency}
									onChange={(event) =>
										setCreatePayload({
											...createPayload,
											currency: event.target.value.toUpperCase(),
										})
									}
									placeholder="Currency"
									required
								/>
								<Input
									value={createPayload.accountId}
									onChange={(event) =>
										setCreatePayload({ ...createPayload, accountId: event.target.value })
									}
									placeholder="Project account ID"
								/>
								<Button type="submit" disabled={isLoading}>
									Create Wallet
								</Button>
							</form>
						</OperationCard>

						<OperationCard title="Get Wallet">
							<form onSubmit={handleLookupWallet} className="space-y-3">
								<Input
									value={lookupWalletId}
									onChange={(event) => setLookupWalletId(event.target.value)}
									placeholder="Wallet ID"
									required
								/>
								<Button type="submit" disabled={isLoading}>
									Get Wallet
								</Button>
							</form>
						</OperationCard>

						<OperationCard title="Credit Wallet">
							<form onSubmit={handleWalletLedgerAction("credit")} className="space-y-3">
								{renderLedgerFields(creditPayload, setCreditPayload)}
								<Button type="submit" disabled={isLoading}>
									Credit Wallet
								</Button>
							</form>
						</OperationCard>
					</div>

					<div className="grid grid-cols-1 gap-6">
						<OperationCard title="Debit Wallet">
							<form onSubmit={handleWalletLedgerAction("debit")} className="space-y-3">
								{renderLedgerFields(debitPayload, setDebitPayload)}
								<Button type="submit" disabled={isLoading}>
									Debit Wallet
								</Button>
							</form>
						</OperationCard>

						<OperationCard title="Transfer">
							<form onSubmit={handleTransfer} className="space-y-3">
								<Input
									value={transferPayload.fromWalletId}
									onChange={(event) =>
										setTransferPayload({
											...transferPayload,
											fromWalletId: event.target.value,
										})
									}
									placeholder="From wallet ID"
									required
								/>
								<Input
									value={transferPayload.toWalletId}
									onChange={(event) =>
										setTransferPayload({
											...transferPayload,
											toWalletId: event.target.value,
										})
									}
									placeholder="To wallet ID"
									required
								/>
								<div className="grid grid-cols-2 gap-3">
									<Input
										value={transferPayload.amount}
										onChange={(event) =>
											setTransferPayload({
												...transferPayload,
												amount: event.target.value,
											})
										}
										placeholder="Amount"
										required
									/>
									<Input
										value={transferPayload.currency}
										onChange={(event) =>
											setTransferPayload({
												...transferPayload,
												currency: event.target.value.toUpperCase(),
											})
										}
										placeholder="Currency"
										required
									/>
								</div>
								<Input
									value={transferPayload.reference}
									onChange={(event) =>
										setTransferPayload({
											...transferPayload,
											reference: event.target.value,
										})
									}
									placeholder="Reference"
									required
								/>
								<Button type="submit" disabled={isLoading}>
									Transfer
								</Button>
							</form>
						</OperationCard>
					</div>
				</div>

				<ResultPanel result={result} />
			</div>
		</DashboardLayout>
	);
};

export default WalletsPage;
