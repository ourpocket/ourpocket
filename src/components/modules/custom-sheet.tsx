import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CustomSheetProps {
	children: ReactNode;
	contentClassName?: string;
	description?: ReactNode;
	footer?: ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	title: ReactNode;
	trigger?: ReactNode;
}

function CustomSheet({
	children,
	contentClassName,
	description,
	footer,
	onOpenChange,
	open,
	title,
	trigger,
}: CustomSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				side="right"
				className={cn(
					"w-full gap-0 border-white/[0.09] !bg-[#171717] text-white sm:max-w-xl",
					contentClassName,
				)}
			>
				<SheetHeader className="border-b border-white/[0.07] p-6 pr-12">
					<SheetTitle asChild>
						<Typography variant="heading">{title}</Typography>
					</SheetTitle>
					{description && (
						<SheetDescription asChild>
							<Typography className="text-white/45">{description}</Typography>
						</SheetDescription>
					)}
				</SheetHeader>
				<div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">{children}</div>
				{footer && <SheetFooter className="border-t border-white/[0.07] p-6">{footer}</SheetFooter>}
			</SheetContent>
		</Sheet>
	);
}

export { CustomSheet };

export type { CustomSheetProps };
