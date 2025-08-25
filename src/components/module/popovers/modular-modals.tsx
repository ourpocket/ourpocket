import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { FC, ReactNode } from "react";

interface IProps {
	trigger?: ReactNode;
	children?: ReactNode;
}

const ModularModals: FC<IProps> = ({ trigger, children }) => {
	return (
		<>
			<Dialog>
				<DialogTrigger>{trigger}</DialogTrigger>
				<DialogContent className={"bg-card"}>
					<DialogHeader>
						<DialogTitle></DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>

					<div className={"mb-3"}>{children}</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ModularModals;
