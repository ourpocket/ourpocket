import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode, createElement } from "react";

type TypographyVariant =
	| "display"
	| "title"
	| "heading"
	| "subheading"
	| "body"
	| "bodySmall"
	| "label"
	| "caption";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

const defaultElements: Record<TypographyVariant, TypographyElement> = {
	display: "h1",
	title: "h2",
	heading: "h3",
	subheading: "h4",
	body: "p",
	bodySmall: "p",
	label: "span",
	caption: "span",
};

const variantClasses: Record<TypographyVariant, string> = {
	display: "text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl",
	title: "text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl",
	heading: "text-lg font-semibold leading-snug tracking-[-0.015em] text-white",
	subheading: "text-sm font-semibold leading-5 text-white",
	body: "text-sm leading-6 text-white/55",
	bodySmall: "text-xs leading-5 text-white/45",
	label: "text-xs font-medium leading-4 text-white/65",
	caption: "text-[11px] font-medium leading-4 text-white/40",
};

interface TypographyProps extends HTMLAttributes<HTMLElement> {
	as?: TypographyElement;
	children: ReactNode;
	variant?: TypographyVariant;
}

function Typography({ as, children, className, variant = "body", ...props }: TypographyProps) {
	const element = as ?? defaultElements[variant];

	return createElement(
		element,
		{
			...props,
			className: cn(variantClasses[variant], className),
		},
		children,
	);
}

export { Typography };

export type { TypographyProps, TypographyVariant };
