import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { ReactNode } from "react";

interface ModularCardProps {
	title?: string | ReactNode;
	description?: string | ReactNode;
	action?: ReactNode;
	content?: ReactNode;
	footer?: ReactNode;
	className?: string;
	children?: ReactNode;
}

const ModularCard = ({
	title,
	description,
	action,
	content,
	footer,
	className = "",
	children,
}: ModularCardProps) => {
	return (
		<Card
			className={`min-w-0 gap-0 overflow-hidden rounded-xl border-white/[0.08] bg-[#1b1b1b] py-0 shadow-none ${className}`}
		>
			{(title || description || action) && (
				<CardHeader className="border-b border-white/[0.07] px-5 py-4 text-white">
					{title && (
						<Typography as="div" variant="subheading">
							{title}
						</Typography>
					)}
					{description && (
						<Typography as="div" variant="bodySmall">
							{description}
						</Typography>
					)}
					{action && <CardAction>{action}</CardAction>}
				</CardHeader>
			)}
			{content && <CardContent className="px-5 py-5 text-white">{children}</CardContent>}
			{footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
};

export { ModularCard };
