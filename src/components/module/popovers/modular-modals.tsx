import { CustomModal } from "@/components/modules/custom-modal";
import type { ReactNode } from "react";

interface ModularModalProps {
	description?: ReactNode;
	title: ReactNode;
	trigger?: ReactNode;
	children?: ReactNode;
}

const ModularModals = ({ children, description, title, trigger }: ModularModalProps) => {
	return (
		<CustomModal trigger={trigger} title={title} description={description}>
			{children}
		</CustomModal>
	);
};

export default ModularModals;
