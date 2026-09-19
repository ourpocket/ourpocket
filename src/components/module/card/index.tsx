import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
					{action && <CardAction>{action}</CardAction>}
				</CardHeader>
			)}
			{content && <CardContent className="px-5 py-5 text-white">{children}</CardContent>}
			{footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
};

export { ModularCard };
