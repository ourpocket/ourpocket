import json from "@shikijs/langs/json";
import shellscript from "@shikijs/langs/shellscript";
import vitesseBlack from "@shikijs/themes/vitesse-black";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

type CodeLanguage = "json" | "shellscript";

type HighlightedLine = Array<{ color?: string; content: string }>;

const highlighter = createHighlighterCore({
	themes: [vitesseBlack],
	langs: [json, shellscript],
	engine: createJavaScriptRegexEngine(),
});

export function SyntaxCode({
	code,
	language,
	label,
	maxHeight = "24rem",
}: {
	code: string;
	language: CodeLanguage;
	label: string;
	maxHeight?: string;
}) {
	const [lines, setLines] = useState<HighlightedLine[]>([]);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		let active = true;
		setLines([]);

		highlighter
			.then((instance) => {
				const highlighted = instance.codeToTokens(code, {
					lang: language,
					theme: "vitesse-black",
				});

				if (active) setLines(highlighted.tokens);
			})
			.catch(() => {
				if (active) setLines([]);
			});

		return () => {
			active = false;
		};
	}, [code, language]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111]">
			<div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
				<div className="flex items-center gap-3">
					<div className="flex gap-1.5" aria-hidden="true">
						<span className="size-2 rounded-full bg-[#ff6b5f]" />
						<span className="size-2 rounded-full bg-[#f5bd4f]" />
						<span className="size-2 rounded-full bg-[#61c454]" />
					</div>
					<span className="text-xs font-medium text-white/55">{label}</span>
				</div>
				<button
					type="button"
					className="inline-flex size-7 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
					onClick={() => void copy()}
					aria-label={`Copy ${label}`}
				>
					{copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
				</button>
			</div>
			<pre
				className="max-w-full overflow-auto px-4 py-4 text-[13px] leading-6"
				style={{ maxHeight }}
				aria-label={label}
			>
				<code className="font-mono">
					{lines.length > 0
						? lines.map((line, lineIndex) => (
								<span
									className="block min-h-6"
									key={`${lineIndex}:${line.map((token) => token.content).join("")}`}
								>
									{line.map((token, tokenIndex) => (
										<span key={`${tokenIndex}:${token.content}`} style={{ color: token.color }}>
											{token.content}
										</span>
									))}
								</span>
							))
						: code}
				</code>
			</pre>
		</div>
	);
}
