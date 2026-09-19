import { CustomModal, CustomModalCancel } from "@/components/modules/custom-modal";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

function LogoutModal({ onConfirm, onOpenChange, open }: LogoutModalProps) {
	return (
		<CustomModal
			open={open}
			onOpenChange={onOpenChange}
			title="Log out of OurPocket?"
			description="You will need to sign in again to access this workspace."
			contentClassName="sm:max-w-sm"
			footer={
				<>
					<CustomModalCancel label="Stay signed in" />
					<Button type="button" onClick={onConfirm}>
						Log out
					</Button>
				</>
			}
		/>
	);
}

export { LogoutModal };
