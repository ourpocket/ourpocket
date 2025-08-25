import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

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
		<Card className={className}>
			{(title || description || action) && (
				<CardHeader className={"text-white"}>
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
					{action && <CardAction>{action}</CardAction>}
				</CardHeader>
			)}
			{content && <CardContent className={"text-white"}>{children}</CardContent>}
			{footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
};

export { ModularCard };
