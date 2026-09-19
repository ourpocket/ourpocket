import { ModularCard } from "@/components/module/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SyntaxCode } from "@/components/ui/syntax-code";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { useCurrentProject } from "@/hooks/use-current-project";
import { API_BASE_URL } from "@/services/api-client";
import { listFinancialResources } from "@/services/financial.service";
import {
	type AmountInput,
	type FinancialResource,
	OurPocket,
	type PaymentInput,
	type RefundInput,
	type Scenario,
} from "@ourpocket/sdk";
import { Braces } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

const scenarioOptions: Scenario[] = [
	"success",
	"failure",
	"pending",
	"insufficient_funds",
	"timeout",
	"provider_outage",
];

const operations = ["payment", "refund", "create_wallet", "fund", "debit", "transfer"] as const;

type Operation = (typeof operations)[number];

function Fields({
	label,
	value,
	onChange,
	type = "text",
	className = "",
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<Label className="grid gap-2 text-xs font-medium text-white/65">
				{label}
				<Input
					aria-label={label}
					type={type}
					value={value}
					onChange={(event) => onChange(event.target.value)}
					required
				/>
			</Label>
		</div>
	);
}

export default function FinancialOperations({
	wallets = false,
	readOnly = false,
}: {
	wallets?: boolean;
	readOnly?: boolean;
}) {
	const { project, environment } = useCurrentProject();
	const [items, setItems] = useState<FinancialResource[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [busy, setBusy] = useState(false);
	const [operation, setOperation] = useState<Operation>(wallets ? "create_wallet" : "payment");
	const [apiKey, setApiKey] = useState("");
	const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID());
	const [amount, setAmount] = useState("50000");
	const [currency, setCurrency] = useState("NGN");
	const [email, setEmail] = useState("");
	const [provider, setProvider] = useState<"paystack" | "flutterwave">("paystack");
	const [walletProvider, setWalletProvider] = useState<"turnkey" | "privy">("turnkey");
	const [chain, setChain] = useState<"ethereum" | "solana">("ethereum");
	const [callbackUrl, setCallbackUrl] = useState("");
	const [resourceId, setResourceId] = useState("");
	const [destination, setDestination] = useState("");
	const [scenario, setScenario] = useState<Scenario>("success");
	const [view, setView] = useState("all");
	const [result, setResult] = useState<FinancialResource | null>(null);
	useEffect(() => {
		setApiKey("");
		setResult(null);
		setResourceId("");
		setDestination("");
		setIdempotencyKey(crypto.randomUUID());
		setItems([]);
		setError(null);
	}, [environment, project?.id]);
	useEffect(() => {
		let cancelled = false;

		if (!project) return;
		setLoading(true);
		listFinancialResources(project.id, wallets ? "wallets" : "transactions")
			.then((resources) => {
				if (!cancelled) {
					setItems(resources);
					setError(null);
				}
			})
			.catch((reason) => {
				if (!cancelled)
					setError(reason instanceof Error ? reason.message : "Could not load operations");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [project?.id, environment]);

	const client = async () => {
		const expected = environment === "sandbox" ? "op_test_sk_" : "op_live_sk_";

		if (!apiKey.startsWith(expected)) throw new Error(`Use a ${environment} project API key`);
		const pocket = new OurPocket({ apiKey, baseUrl: API_BASE_URL });
		const context = await pocket.context.get();

		if (context.projectId !== project?.id || context.environment !== environment)
			throw new Error("Use the selected project’s API key");

		return pocket;
	};

	async function execute(action: () => Promise<FinancialResource>) {
		setBusy(true);
		setError(null);

		try {
			const response = await action();

			if (response.projectId !== project?.id || response.environment !== environment)
				throw new Error("API key belongs to a different project or environment");
			setResult(response);

			if (project)
				setItems(await listFinancialResources(project.id, wallets ? "wallets" : "transactions"));
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Request failed");
		} finally {
			setBusy(false);
		}
	}

	async function submit(event: FormEvent) {
		event.preventDefault();
		await execute(async () => {
			if (idempotencyKey.length > 190)
				throw new Error("Use an idempotency key of at most 190 characters");
			const pocket = await client();
			const options = { idempotencyKey };
			const input: AmountInput = { amount, currency };

			if (environment === "sandbox") input.scenario = scenario;

			if (operation === "payment") {
				const customer = await pocket.customers.create(
					{ email },
					{ idempotencyKey: `${idempotencyKey}-customer` },
				);

				const payment: PaymentInput = { ...input, customer: customer.id, provider };

				if (callbackUrl) payment.callbackUrl = callbackUrl;

				return pocket.payments.create(payment, options);
			}

			if (operation === "refund") {
				const refund: RefundInput = { payment: resourceId, amount };

				if (environment === "sandbox") refund.scenario = scenario;

				return pocket.refunds.create(refund, options);
			}

			if (operation === "create_wallet")
				return pocket.wallets.create(
					{
						currency,
						provider: environment === "production" ? walletProvider : undefined,
						chain: environment === "production" ? chain : undefined,
					},
					options,
				);

			if (operation === "fund") return pocket.wallets.fund(resourceId, input, options);

			if (operation === "debit") return pocket.wallets.debit(resourceId, input, options);

			return pocket.transfers.create(
				{ ...input, fromWallet: resourceId, toWallet: destination },
				options,
			);
		});
	}

	const visible = items.filter((item) =>
		wallets
			? item.kind === "wallet" || item.kind === "transfer"
			: ["payment", "refund", "transfer"].includes(item.kind) &&
				(view === "all" || item.kind === view),
	);

	const unavailable = wallets && environment === "production" && operation !== "create_wallet";

	const endpoint = (() => {
		if (operation === "payment") return "/payments";

		if (operation === "refund") return "/refunds";

		if (operation === "create_wallet") return "/wallets";

		if (operation === "transfer") return "/sandbox/transfers";

		return `/sandbox/wallets/${resourceId || "{wallet_id}"}/${operation}`;
	})();

	const requestBody = (() => {
		if (operation === "payment")
			return {
				customer: "{customer_id}",
				amount,
				currency,
				provider,
				scenario: environment === "sandbox" ? scenario : undefined,
			};

		if (operation === "refund")
			return {
				payment: resourceId || "{payment_id}",
				amount,
				scenario: environment === "sandbox" ? scenario : undefined,
			};

		if (operation === "create_wallet")
			return {
				currency,
				provider: environment === "production" ? walletProvider : undefined,
				chain: environment === "production" ? chain : undefined,
			};

		if (operation === "transfer")
			return {
				fromWallet: resourceId || "{wallet_id}",
				toWallet: destination || "{destination_wallet_id}",
				amount,
				currency,
				scenario,
			};

		return { amount, currency, scenario };
	})();

	const requestPreview = `curl --request POST '${API_BASE_URL}${endpoint}' \\
  --header 'Authorization: Bearer $OURPOCKET_${environment === "sandbox" ? "SANDBOX" : "LIVE"}_KEY' \\
  --header 'Idempotency-Key: ${idempotencyKey}' \\
  --header 'Content-Type: application/json' \\
  --data '${JSON.stringify(requestBody, null, 2)}'`;

	const resultPreview = result
		? JSON.stringify(result, null, 2)
		: JSON.stringify(
				{
					status: "ready",
					message: "Run an operation or inspect a record below.",
				},
				null,
				2,
			);

	return (
		<div className="space-y-6">
			<Typography className="max-w-3xl">
				{unavailable
					? "Funding, debits, and internal transfers are simulated in Sandbox. Production wallet creation uses your connected wallet provider."
					: environment === "sandbox"
						? "Simulated financial infrastructure. No real money moves."
						: "Operations use your connected provider account. Routing decisions and uncertain outcomes remain inspectable."}
			</Typography>
			{error && (
				<div
					role="alert"
					className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
				>
					{error}
				</div>
			)}
			{!readOnly && (
				<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
					<ModularCard title={wallets ? "Wallet operation" : "Financial operation"} content>
						<form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={submit}>
							<Label className="grid gap-2 text-xs font-medium text-white/65">
								Operation
								<Select
									value={operation}
									onValueChange={(value) => {
										const selected = operations.find((operation) => operation === value);

										if (selected) setOperation(selected);
									}}
								>
									<SelectTrigger aria-label="Operation">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{(wallets
											? ["create_wallet", "fund", "debit", "transfer"]
											: ["payment", "refund"]
										).map((value) => (
											<SelectItem key={value} value={value}>
												{value.replaceAll("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Label>
							<Fields
								label={`${environment} project API key`}
								type="password"
								value={apiKey}
								onChange={setApiKey}
								className="sm:col-span-2"
							/>
							{operation !== "create_wallet" && (
								<Fields label="Amount (minor units)" value={amount} onChange={setAmount} />
							)}
							<Fields label="Currency" value={currency} onChange={setCurrency} />
							{operation === "create_wallet" && environment === "production" && (
								<>
									<Label className="grid gap-2 text-xs font-medium text-white/65">
										Wallet provider
										<Select
											value={walletProvider}
											onValueChange={(value) => {
												if (value === "turnkey" || value === "privy") setWalletProvider(value);
											}}
										>
											<SelectTrigger aria-label="Wallet provider">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="turnkey">Turnkey</SelectItem>
												<SelectItem value="privy">Privy</SelectItem>
											</SelectContent>
										</Select>
									</Label>
									<Label className="grid gap-2 text-xs font-medium text-white/65">
										Network
										<Select
											value={chain}
											onValueChange={(value) => {
												if (value === "ethereum" || value === "solana") setChain(value);
											}}
										>
											<SelectTrigger aria-label="Network">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ethereum">Ethereum</SelectItem>
												<SelectItem value="solana">Solana</SelectItem>
											</SelectContent>
										</Select>
									</Label>
								</>
							)}
							{operation === "payment" && (
								<>
									<Fields label="Customer email" type="email" value={email} onChange={setEmail} />
									<Label className="grid gap-2 text-xs font-medium text-white/65">
										Provider
										<Select
											value={provider}
											onValueChange={(value) => {
												if (value === "paystack" || value === "flutterwave") setProvider(value);
											}}
										>
											<SelectTrigger aria-label="Provider">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="paystack">Paystack</SelectItem>
												<SelectItem value="flutterwave">Flutterwave</SelectItem>
											</SelectContent>
										</Select>
									</Label>
									<Label className="grid gap-2 text-xs font-medium text-white/65 sm:col-span-2">
										Checkout return URL
										<Input
											type="url"
											value={callbackUrl}
											onChange={(event) => setCallbackUrl(event.target.value)}
											placeholder="https://yourapp.com/checkout"
											required={environment === "production" && provider === "flutterwave"}
										/>
									</Label>
								</>
							)}
							{["refund", "fund", "debit", "transfer"].includes(operation) && (
								<Fields
									label={operation === "refund" ? "Payment ID" : "Wallet ID"}
									value={resourceId}
									onChange={setResourceId}
								/>
							)}
							{operation === "transfer" && (
								<Fields
									label="Destination wallet ID"
									value={destination}
									onChange={setDestination}
								/>
							)}
							{environment === "sandbox" && operation !== "create_wallet" && (
								<Label className="grid gap-2 text-xs font-medium text-white/65">
									Simulation
									<Select
										value={scenario}
										onValueChange={(value) => {
											const selected = scenarioOptions.find((option) => option === value);

											if (selected) setScenario(selected);
										}}
									>
										<SelectTrigger aria-label="Simulation">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{scenarioOptions.map((value) => (
												<SelectItem key={value} value={value}>
													{value.replaceAll("_", " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Label>
							)}
							<Fields
								label="Idempotency key"
								value={idempotencyKey}
								onChange={setIdempotencyKey}
								className="sm:col-span-2"
							/>
							<div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-4 sm:col-span-2">
								<Button type="submit" disabled={busy || unavailable || !project}>
									{busy ? "Sending…" : "Run operation"}
								</Button>
								<Button
									variant="outline"
									type="button"
									disabled={busy}
									onClick={() => setIdempotencyKey(crypto.randomUUID())}
								>
									New operation key
								</Button>
							</div>
						</form>
					</ModularCard>
					<ModularCard
						title={environment === "sandbox" ? "Sandbox request" : "API request"}
						content
					>
						<div className="space-y-4">
							<SyntaxCode
								code={requestPreview}
								language="shellscript"
								label="request.sh"
								maxHeight="20rem"
							/>
							<SyntaxCode
								code={resultPreview}
								language="json"
								label="response.json"
								maxHeight="20rem"
							/>
						</div>
						{result?.kind === "payment" && result.details.checkoutUrl && (
							<a
								className="mt-4 inline-block text-sm text-orange-400 underline"
								href={result.details.checkoutUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open hosted checkout
							</a>
						)}
					</ModularCard>
				</div>
			)}
			<ModularCard
				title={wallets ? "Wallets and transfers" : "Payments and refunds"}
				action={<span className="text-xs font-normal text-white/40">{visible.length} records</span>}
				content
			>
				{!wallets && (
					<div className="mb-5 flex gap-6 border-b border-white/[0.07]">
						{["all", "payment", "refund"].map((value) => (
							<button
								type="button"
								key={value}
								className={`border-b-2 px-0 pb-3 text-sm transition-colors ${
									view === value
										? "border-orange-400 text-white"
										: "border-transparent text-white/40 hover:text-white/70"
								}`}
								onClick={() => setView(value)}
							>
								{value === "all"
									? "All transactions"
									: value === "payment"
										? "Payments"
										: "Refunds"}
							</button>
						))}
					</div>
				)}
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{["ID", "Type", "Amount / balance", "Currency", "Status", "Action"].map((label) => (
									<TableHead key={label}>{label}</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{visible.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="font-mono text-xs">{item.id}</TableCell>
									<TableCell>{item.kind}</TableCell>
									<TableCell>
										{item.kind === "wallet" ? String(item.details.balance) : item.amount}
									</TableCell>
									<TableCell>{item.currency}</TableCell>
									<TableCell>
										<Badge variant="outline">{item.status}</Badge>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setResult(item);
													setResourceId(item.id);
												}}
											>
												Inspect
											</Button>
											{!readOnly && ["pending", "unknown"].includes(item.status) && (
												<>
													{environment === "sandbox" ? (
														<>
															<Button
																size="sm"
																disabled={busy}
																onClick={() =>
																	void execute(async () =>
																		(await client()).sandbox.complete(item.id, "completed"),
																	)
																}
															>
																Complete
															</Button>
															<Button
																size="sm"
																variant="outline"
																disabled={busy}
																onClick={() =>
																	void execute(async () =>
																		(await client()).sandbox.complete(item.id, "failed"),
																	)
																}
															>
																Fail
															</Button>
														</>
													) : (
														<Button
															size="sm"
															disabled={busy}
															onClick={() =>
																void execute(async () =>
																	item.kind === "refund"
																		? (await client()).refunds.verify(item.id)
																		: (await client()).payments.verify(item.id),
																)
															}
														>
															Verify
														</Button>
													)}
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{visible.length === 0 && (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 py-8 text-center">
						<div className="flex size-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/25">
							<Braces className="size-5" />
						</div>
						<Typography variant="subheading">
							{loading ? "Loading operations…" : "No operations yet"}
						</Typography>
						{!loading && (
							<Typography variant="caption" className="max-w-sm">
								{readOnly
									? "Operations appear here as they move through the control plane."
									: "Run your first operation above. It will appear here with its normalized status."}
							</Typography>
						)}
					</div>
				)}
			</ModularCard>
		</div>
	);
}
