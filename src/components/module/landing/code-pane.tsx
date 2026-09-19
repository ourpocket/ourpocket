import { Check, Copy } from "lucide-react";
import { type ReactNode, useState } from "react";

const languages = ["TypeScript", "cURL", "JSON"] as const;

type Language = (typeof languages)[number];

const snippets: Record<Language, ReactNode[]> = {
	TypeScript: [
		<span key="import">
			<i>import</i> {"{ OurPocket }"} <i>from</i> <s>"@ourpocket/sdk"</s>;
		</span>,
		<span key="client">
			<i>const</i> pocket = <i>new</i> <b>OurPocket</b>({"{ apiKey }"});
		</span>,
		<span key="payment">
			<i>await</i> pocket.payments.<em>create</em>({"{"}
		</span>,
		<span key="amount">
			{" "}
			amount: <s>"50000"</s>, currency: <s>"NGN"</s>,
		</span>,
		<span key="currency">
			{" "}
			provider: <s>"paystack"</s>, reference: <s>"order_4821"</s>,
		</span>,
		<span key="contact">
			{" "}
			contact: {"{ email: "}
			<s>"buyer@example.com"</s>
			{" }"}
		</span>,
		<span key="close">{"}"});</span>,
	],
	cURL: [
		<span key="curl">
			<i>curl</i> -X POST /v1/payments \
		</span>,
		<span key="auth">
			{" "}
			-H <s>"Authorization: Bearer $OURPOCKET_KEY"</s> \
		</span>,
		<span key="body">
			{" "}
			-d{" "}
			<s>
				{
					'\'{"amount":"50000","currency":"NGN","provider":"paystack","reference":"order_4821","contact":{"email":"buyer@example.com"}}\''
				}
			</s>
		</span>,
	],
	JSON: [
		<span key="open">{"{"}</span>,
		<span key="kind">
			{" "}
			<s>"kind"</s>: <s>"payment"</s>,
		</span>,
		<span key="status">
			{" "}
			<s>"status"</s>: <s>"completed"</s>,
		</span>,
		<span key="environment">
			{" "}
			<s>"environment"</s>: <s>"sandbox"</s>,
		</span>,
		<span key="currency">
			{" "}
			<s>"currency"</s>: <s>"NGN"</s>
		</span>,
		<span key="close">{"}"}</span>,
	],
};

const plainSnippets: Record<Language, string> = {
	TypeScript:
		'import { OurPocket } from "@ourpocket/sdk";\n\nconst pocket = new OurPocket({ apiKey });\nawait pocket.payments.create({ amount: "50000", currency: "NGN", provider: "paystack", reference: "order_4821", contact: { email: "buyer@example.com" } });',
	cURL: 'curl -X POST /v1/payments \\\n  -H "Authorization: Bearer $OURPOCKET_KEY" \\\n  -d \'{"amount":"50000","currency":"NGN","provider":"paystack","reference":"order_4821","contact":{"email":"buyer@example.com"}}\'',
	JSON: '{\n  "kind": "payment",\n  "status": "completed",\n  "environment": "sandbox",\n  "currency": "NGN"\n}',
};

const fileNames: Record<Language, string> = {
	TypeScript: "create_payment.ts",
	cURL: "request.sh",
	JSON: "response.json",
};

export function CodePane() {
	const [language, setLanguage] = useState<Language>("TypeScript");
	const [copied, setCopied] = useState(false);

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(plainSnippets[language]);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="code-pane">
			<div className="code-pane-toolbar">
				<div className="code-pane-dots" aria-hidden="true">
					<i />
					<i />
					<i />
				</div>
				<span>{fileNames[language]}</span>
				<button
					type="button"
					onClick={() => void copyCode()}
					aria-label={copied ? "Code copied" : "Copy code"}
				>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
			</div>
			<pre className="code-pane-content" aria-label={`${language} payment example`}>
				<code>{snippets[language]}</code>
			</pre>
			<div className="code-pane-tabs" role="tablist" aria-label="Code format">
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
