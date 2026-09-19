import json from "@shikijs/langs/json";
import shellscript from "@shikijs/langs/shellscript";
import typescript from "@shikijs/langs/typescript";
import vitesseBlack from "@shikijs/themes/vitesse-black";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const paymentInput = {
	amount: "50000",
	currency: "NGN",
	scenario: "success",
} as const;

const examples = {
	TypeScript: {
		fileName: "create_payment.ts",
		language: "typescript",
		code: [
			'import { OurPocket } from "@ourpocket/sdk";',
			"",
			"const apiKey = process.env.OURPOCKET_API_KEY;",
			'if (!apiKey) throw new Error("Set OURPOCKET_API_KEY");',
			"",
			"const pocket = new OurPocket({ apiKey });",
			"const payment = await pocket.payments.create(",
			'  { amount: "50000", currency: "NGN", scenario: "success" },',
			'  { idempotencyKey: "order_4821" },',
			");",
			"console.log(payment);",
		].join("\n"),
	},
	cURL: {
		fileName: "request.sh",
		language: "shellscript",
		code: [
			'curl -X POST "https://nass-api.up.railway.app/v1/payments" \\',
			'  -H "Authorization: Bearer $OURPOCKET_API_KEY" \\',
			'  -H "Content-Type: application/json" \\',
			'  -H "Idempotency-Key: order_4821" \\',
			`  -d '${JSON.stringify(paymentInput)}'`,
		].join("\n"),
	},
	JSON: {
		fileName: "request.json",
		language: "json",
		code: JSON.stringify(paymentInput, null, 2),
	},
} as const;

type Language = keyof typeof examples;
type HighlightedLine = Array<{ color?: string; content: string }>;

const highlighter = createHighlighterCore({
	themes: [vitesseBlack],
	langs: [typescript, shellscript, json],
	engine: createJavaScriptRegexEngine(),
});

export function CodePane() {
	const [language, setLanguage] = useState<Language>("TypeScript");
	const [lines, setLines] = useState<HighlightedLine[]>([]);
	const [copied, setCopied] = useState(false);
	const example = examples[language];

	useEffect(() => {
		let active = true;
		setLines([]);
		highlighter
			.then((instance) => instance.codeToTokens(example.code, { lang: example.language, theme: "vitesse-black" }))
			.then((result) => {
				if (active) setLines(result.tokens);
			})
			.catch(() => {
				if (active) setLines([]);
			});
		return () => {
			active = false;
		};
	}, [example]);

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(example.code);
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
				<span>{example.fileName}</span>
				<button
					type="button"
					onClick={() => void copyCode()}
					aria-label={copied ? "Code copied" : "Copy code"}
				>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
			</div>
			<pre className="code-pane-content" aria-label={`${language} sandbox payment request`}>
				<code>
					{lines.length > 0
						? lines.map((line, lineIndex) => (
								<span key={`${language}:${lineIndex}`}>
									{line.map((token, tokenIndex) => (
										<span key={`${tokenIndex}:${token.content}`} style={{ color: token.color }}>
											{token.content}
										</span>
									))}
								</span>
							))
						: example.code}
				</code>
			</pre>
			<div className="code-pane-tabs" role="tablist" aria-label="Code format">
				{(Object.keys(examples) as Language[]).map((item) => (
					<button
						type="button"
						role="tab"
						aria-selected={language === item}
						className={language === item ? "is-active" : ""}
						onClick={() => {
							setLanguage(item);
							setCopied(false);
						}}
						key={item}
					>
						{item}
					</button>
				))}
			</div>
		</div>
	);
}
