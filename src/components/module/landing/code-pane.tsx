import { Check, Copy } from "lucide-react";
import { type ReactNode, useState } from "react";

const languages = ["TypeScript", "Python", "Go"] as const;

type Language = (typeof languages)[number];

const snippets: Record<Language, ReactNode[]> = {
	TypeScript: [
		<span key="import">
			<i>import</i> OurPocket <i>from</i> <s>"@ourpocket/sdk"</s>;
		</span>,
		<span key="client">
			<i>const</i> pocket = <i>new</i> <b>OurPocket</b>();
		</span>,
		<span key="wallet">
			<i>await</i> pocket.wallets.<em>create</em>({"{"}
		</span>,
		<span key="customer">
			{" "}
			customerId: <s>"cus_8462"</s>,
		</span>,
		<span key="currency">
			{" "}
			currency: <s>"NGN"</s>,
		</span>,
		<span key="close">{"}"});</span>,
	],
	Python: [
		<span key="import">
			<i>from</i> ourpocket <i>import</i> <b>OurPocket</b>
		</span>,
		<span key="client">
			pocket = <b>OurPocket</b>()
		</span>,
		<span key="wallet">
			wallet = pocket.wallets.<em>create</em>(
		</span>,
		<span key="customer">
			{" "}
			customer_id=<s>"cus_8462"</s>,
		</span>,
		<span key="currency">
			{" "}
			currency=<s>"NGN"</s>,
		</span>,
		<span key="close">)</span>,
	],
	Go: [
		<span key="client">
			pocket := <b>ourpocket.New</b>()
		</span>,
		<span key="wallet">
			wallet, err := pocket.Wallets.<em>Create</em>(ctx,
		</span>,
		<span key="customer">
			{" "}
			<b>ourpocket.Wallet</b>
			{"{"}
		</span>,
		<span key="id">
			{" "}
			CustomerID: <s>"cus_8462"</s>,
		</span>,
		<span key="currency">
			{" "}
			Currency: <s>"NGN"</s>,
		</span>,
		<span key="close"> {"}"})</span>,
	],
};

const plainSnippets: Record<Language, string> = {
	TypeScript:
		'import OurPocket from "@ourpocket/sdk";\n\nconst pocket = new OurPocket();\nawait pocket.wallets.create({ customerId: "cus_8462", currency: "NGN" });',
	Python:
		'from ourpocket import OurPocket\n\npocket = OurPocket()\nwallet = pocket.wallets.create(customer_id="cus_8462", currency="NGN")',
	Go: 'pocket := ourpocket.New()\nwallet, err := pocket.Wallets.Create(ctx, ourpocket.Wallet{ CustomerID: "cus_8462", Currency: "NGN" })',
};

export function CodePane() {
	const [language, setLanguage] = useState<Language>("TypeScript");
	const [copied, setCopied] = useState(false);

	const copyCode = async () => {
		await navigator.clipboard.writeText(plainSnippets[language]);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="code-pane">
			<div className="code-pane-toolbar">
				<div className="code-pane-dots" aria-hidden="true">
					<i />
					<i />
					<i />
				</div>
				<span>
					create_wallet.
					{language === "TypeScript" ? "ts" : language === "Python" ? "py" : "go"}
				</span>
				<button type="button" onClick={copyCode} aria-label={copied ? "Code copied" : "Copy code"}>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
			</div>
			<pre className="code-pane-content" aria-label={`${language} wallet creation example`}>
				<code>{snippets[language]}</code>
			</pre>
			<div className="code-pane-tabs" role="tablist" aria-label="Code language">
				{languages.map((item) => (
					<button
						type="button"
						role="tab"
						aria-selected={language === item}
						className={language === item ? "is-active" : ""}
						onClick={() => setLanguage(item)}
						key={item}
					>
						{item}
					</button>
				))}
			</div>
		</div>
	);
}
