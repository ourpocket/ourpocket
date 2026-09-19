import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface FallbackProps {
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
	description: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
	tone?: "empty" | "error";
}

function Fallback({ action, className, description, icon, title, tone = "empty" }: FallbackProps) {
	const fallbackIcon =
		tone === "error" ? (
			<AlertCircle className="size-5" aria-hidden="true" />
		) : (
			<Inbox className="size-5" aria-hidden="true" />
		);

	return (
		<div
			className={cn(
				"flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-12 text-center",
				className,
			)}
		>
			<div
				className={cn(
					"flex size-11 items-center justify-center rounded-xl border",
					tone === "error"
						? "border-red-500/20 bg-red-500/10 text-red-300"
						: "border-white/[0.07] bg-white/[0.025] text-white/30",
				)}
			>
				{icon ?? fallbackIcon}
			</div>
			<Typography variant="subheading" className="mt-4">
				{title}
			</Typography>
			<Typography className="mt-1.5 max-w-md">{description}</Typography>
			{action && (
				<Button type="button" className="mt-5" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	);
}

export { Fallback };

export type { FallbackProps };
