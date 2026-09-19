import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CustomModalProps {
	children?: ReactNode;
	contentClassName?: string;
	description?: ReactNode;
	footer?: ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	showCloseButton?: boolean;
	title: ReactNode;
	trigger?: ReactNode;
}

function CustomModal({
	children,
	contentClassName,
	description,
	footer,
	onOpenChange,
	open,
	showCloseButton = true,
	title,
	trigger,
}: CustomModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent
				showCloseButton={showCloseButton}
				className={cn(
					"border-white/[0.09] !bg-[#1b1b1b] text-white shadow-2xl shadow-black/30",
					contentClassName,
				)}
			>
				<DialogHeader>
					<DialogTitle asChild>
						<Typography variant="heading">{title}</Typography>
					</DialogTitle>
					{description && (
						<DialogDescription asChild>
							<Typography className="text-white/45">{description}</Typography>
						</DialogDescription>
					)}
				</DialogHeader>
				{children && <div className="min-w-0">{children}</div>}
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

function CustomModalClose({ children }: { children: ReactNode }) {
	return <DialogClose asChild>{children}</DialogClose>;
}

function CustomModalCancel({ disabled, label = "Cancel" }: { disabled?: boolean; label?: string }) {
	return (
		<CustomModalClose>
			<Button
				type="button"
				variant="outline"
				disabled={disabled}
				className="border-white/[0.09] !bg-transparent text-white/65 hover:!bg-white/[0.05] hover:text-white"
			>
				{label}
			</Button>
		</CustomModalClose>
	);
}

export { CustomModal, CustomModalCancel, CustomModalClose };

export type { CustomModalProps };
