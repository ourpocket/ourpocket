import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MacLikeCodeBlockProps {
	code: string;
	language?: string;
}

export function MacLikeCodeBlock({ code, language = "typescript" }: MacLikeCodeBlockProps) {
	return (
		<div className="mt-12 w-full bg-white/5 h-[500px] rounded-lg max-w-4xl p-4 backdrop-blur-lg">
			<div className="h-full w-full bg-[#1e1e1e] rounded-lg p-4 relative text-sm font-mono text-white overflow-auto">
				<div className="flex space-x-2 mb-4">
					<span className="w-3 h-3 rounded-full bg-red-500" />
					<span className="w-3 h-3 rounded-full bg-yellow-400" />
					<span className="w-3 h-3 rounded-full bg-green-500" />
				</div>

				<SyntaxHighlighter
					language={language}
					style={oneDark}
					customStyle={{ background: "transparent", padding: 0 }}
				>
					{code}
				</SyntaxHighlighter>
			</div>
		</div>
	);
}

export default MacLikeCodeBlock;
