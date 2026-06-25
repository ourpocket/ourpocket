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
import { useTransactions } from "@/hooks/use-transactions";
import {
	type CreateTransactionPayload,
	type ProviderCredential,
	ProviderType,
	RoutingStrategy,
	TransactionType,
} from "@/services/types";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

const providerOptions = [ProviderType.PAYSTACK, ProviderType.FLUTTERWAVE];
const routingOptions = Object.values(RoutingStrategy);
const transactionTypeOptions = Object.values(TransactionType);

function parseJsonObject(value: string) {
	if (!value.trim()) {
		return undefined;
	}

	return JSON.parse(value) as Record<string, unknown>;
}

function parseProviderCredentials(value: string) {
	if (!value.trim()) {
		return undefined;
	}

	const parsed = JSON.parse(value) as ProviderCredential[];
	return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
}

function ResultPanel({ result }: { result: unknown }) {
	return (
		<ModularCard title="Response" content className="w-full">
			<pre className="max-h-[420px] overflow-auto rounded-md bg-black/30 p-4 text-xs text-gray-200">
				{result
					? JSON.stringify(result, null, 2)
					: "Run a transaction request to see the response."}
			</pre>
		</ModularCard>
	);
}

const TransactionsPage = () => {
	const { createTransaction, getTransaction, isLoading } = useTransactions();
	const [projectApiKey, setProjectApiKey] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [provider, setProvider] = useState("none");
	const [providerApiKey, setProviderApiKey] = useState("");
	const [routingStrategy, setRoutingStrategy] = useState("none");
	const [providerPriority, setProviderPriority] = useState("");
	const [providerCredentials, setProviderCredentials] = useState("[]");
	const [providerPayload, setProviderPayload] = useState("{}");
	const [metadata, setMetadata] = useState("{}");
	const [result, setResult] = useState<unknown>(null);
	const [payload, setPayload] = useState({
		type: TransactionType.CREDIT,
		amount: "",
		currency: "NGN",
		reference: "",
		walletId: "",
		fromWalletId: "",
		toWalletId: "",
	});

	const requireApiKey = () => {
		if (!projectApiKey.trim()) {
			toast.error("Project API key is required");
			return null;
		}

		return projectApiKey.trim();
	};

	const handleCreateTransaction = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const apiKey = requireApiKey();
		if (!apiKey) return;

		let parsedProviderPayload: Record<string, unknown> | undefined;
		let parsedMetadata: Record<string, unknown> | undefined;
		let parsedProviderCredentials: ProviderCredential[] | undefined;

		try {
			parsedProviderPayload = parseJsonObject(providerPayload);
			parsedMetadata = parseJsonObject(metadata);
			parsedProviderCredentials = parseProviderCredentials(providerCredentials);
		} catch {
			toast.error("Provider payload, credentials, and metadata must be valid JSON");
			return;
		}

		const request: CreateTransactionPayload = {
			type: payload.type,
			amount: payload.amount,
			currency: payload.currency,
			reference: payload.reference,
			walletId: payload.walletId || undefined,
			fromWalletId: payload.fromWalletId || undefined,
			toWalletId: payload.toWalletId || undefined,
			provider: provider === "none" ? undefined : (provider as ProviderType),
			apiKey: providerApiKey || undefined,
			routingStrategy:
				routingStrategy === "none" ? undefined : (routingStrategy as RoutingStrategy),
			providerPriority: providerPriority
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean) as ProviderType[],
			providerCredentials: parsedProviderCredentials,
			providerPayload: parsedProviderPayload,
			metadata: parsedMetadata,
		};

		if (request.providerPriority?.length === 0) {
			delete request.providerPriority;
		}

		const response = await createTransaction(apiKey, request);
		setResult(response);
		toast.success("Transaction submitted");
	};

	const handleGetTransaction = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const apiKey = requireApiKey();
		if (!apiKey) return;

		const response = await getTransaction(apiKey, transactionId);
		setResult(response);
	};

	return (
		<DashboardLayout
			title="Transactions"
			description="Create and inspect unified project transactions"
		>
			<div className="grid grid-cols-1 gap-6">
				<ModularCard title="Project API Key" content>
					<Input
						value={projectApiKey}
						onChange={(event) => setProjectApiKey(event.target.value)}
						placeholder="op_test_sk_... or op_live_sk_..."
					/>
				</ModularCard>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ModularCard title="Create Transaction" content>
						<form onSubmit={handleCreateTransaction} className="space-y-3">
							<Select
								value={payload.type}
								onValueChange={(type) => setPayload({ ...payload, type: type as TransactionType })}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Transaction type" />
								</SelectTrigger>
								<SelectContent>
									{transactionTypeOptions.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="grid grid-cols-2 gap-3">
								<Input
									value={payload.amount}
									onChange={(event) => setPayload({ ...payload, amount: event.target.value })}
									placeholder="Amount"
									required
								/>
								<Input
									value={payload.currency}
									onChange={(event) =>
										setPayload({
											...payload,
											currency: event.target.value.toUpperCase(),
										})
									}
									placeholder="Currency"
									required
								/>
							</div>
							<Input
								value={payload.reference}
								onChange={(event) => setPayload({ ...payload, reference: event.target.value })}
								placeholder="Reference"
								required
							/>
							<Input
								value={payload.walletId}
								onChange={(event) => setPayload({ ...payload, walletId: event.target.value })}
								placeholder="Wallet ID for credit/debit"
							/>
							<div className="grid grid-cols-2 gap-3">
								<Input
									value={payload.fromWalletId}
									onChange={(event) =>
										setPayload({
											...payload,
											fromWalletId: event.target.value,
										})
									}
									placeholder="From wallet ID"
								/>
								<Input
									value={payload.toWalletId}
									onChange={(event) => setPayload({ ...payload, toWalletId: event.target.value })}
									placeholder="To wallet ID"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<Select value={provider} onValueChange={setProvider}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Provider" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No provider</SelectItem>
										{providerOptions.map((item) => (
											<SelectItem key={item} value={item}>
												{item}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={routingStrategy} onValueChange={setRoutingStrategy}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Routing strategy" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No routing</SelectItem>
										{routingOptions.map((item) => (
											<SelectItem key={item} value={item}>
												{item}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Input
								value={providerPriority}
								onChange={(event) => setProviderPriority(event.target.value)}
								placeholder="Provider priority CSV"
							/>
							<Input
								value={providerApiKey}
								onChange={(event) => setProviderApiKey(event.target.value)}
								placeholder="Provider secret key"
							/>
							<Textarea
								value={providerCredentials}
								onChange={(event) => setProviderCredentials(event.target.value)}
								placeholder="Provider credentials JSON array for routing"
							/>
							<Textarea
								value={providerPayload}
								onChange={(event) => setProviderPayload(event.target.value)}
								placeholder="Provider payload JSON"
							/>
							<Textarea
								value={metadata}
								onChange={(event) => setMetadata(event.target.value)}
								placeholder="Metadata JSON"
							/>
							<Button type="submit" disabled={isLoading}>
								Create Transaction
							</Button>
						</form>
					</ModularCard>

					<div className="grid grid-cols-1 gap-6">
						<ModularCard title="Get Transaction" content>
							<form onSubmit={handleGetTransaction} className="space-y-3">
								<Input
									value={transactionId}
									onChange={(event) => setTransactionId(event.target.value)}
									placeholder="Transaction ID"
									required
								/>
								<Button type="submit" disabled={isLoading}>
									Get Transaction
								</Button>
							</form>
						</ModularCard>
						<ResultPanel result={result} />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default TransactionsPage;
