import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearAuthToken } from "@/lib/session";
import { ApiError } from "@/services/api-client";
import type { PlatformAccount } from "@/services/types";
import { useNavigate } from "@tanstack/react-router";
import { Building2, LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

interface CreateWorkspaceDialogProps {
	open: boolean;
	createWorkspace: (input: { name: string; companyName?: string }) => Promise<PlatformAccount>;
	onCreated: (platformAccount: PlatformAccount) => void;
	onConflict: () => Promise<void>;
}

function CreateWorkspaceDialog({
	open,
	createWorkspace,
	onCreated,
	onConflict,
}: CreateWorkspaceDialogProps) {
	const navigate = useNavigate();
	const [workspaceName, setWorkspaceName] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = workspaceName.trim();

		if (!name) {
			setErrorMessage("Enter a workspace name to continue.");

			return;
		}

		setErrorMessage(null);
		setIsSubmitting(true);

		try {
			const platformAccount = await createWorkspace({
				name,
				companyName: companyName.trim() || undefined,
			});

			onCreated(platformAccount);
		} catch (error) {
			if (error instanceof ApiError && error.statusCode === 409) {
				await onConflict();

				return;
			}

			setErrorMessage(
				error instanceof Error
					? error.message
					: "We could not create your workspace. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSignOut = async () => {
		clearAuthToken();
		await navigate({ to: "/auth/login" });
	};

	return (
		<Dialog open={open}>
			<DialogContent
				showCloseButton={false}
				className="max-w-md border-white/10 bg-[#1b1b1b] p-0 text-white"
				onEscapeKeyDown={(event) => event.preventDefault()}
				onInteractOutside={(event) => event.preventDefault()}
				onPointerDownOutside={(event) => event.preventDefault()}
			>
				<div className="border-b border-white/10 px-6 pt-6 pb-5">
					<div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
						<Building2 className="size-5" aria-hidden="true" />
					</div>
					<DialogHeader className="gap-2 text-left">
						<DialogTitle className="text-xl tracking-[-0.02em] text-white">
							Set up your workspace
						</DialogTitle>
						<DialogDescription className="leading-6 text-gray-300">
							Your workspace keeps your projects, API keys, providers, wallets, and transaction
							activity together.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
					<div className="space-y-2">
						<Label htmlFor="workspace-name">Workspace name</Label>
						<Input
							autoFocus
							id="workspace-name"
							value={workspaceName}
							onChange={(event) => setWorkspaceName(event.target.value)}
							placeholder="Acme Payments"
							required
							disabled={isSubmitting}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="company-name">
							Company name <span className="text-gray-500">(optional)</span>
						</Label>
						<Input
							id="company-name"
							value={companyName}
							onChange={(event) => setCompanyName(event.target.value)}
							placeholder="Acme Financial Technologies"
							disabled={isSubmitting}
						/>
					</div>

					{errorMessage && (
						<p role="alert" className="text-sm leading-5 text-red-300">
							{errorMessage}
						</p>
					)}

					<DialogFooter className="gap-3 pt-2 sm:justify-between">
						<Button
							type="button"
							variant="ghost"
							onClick={() => void handleSignOut()}
							disabled={isSubmitting}
						>
							<LogOut aria-hidden="true" />
							Sign out
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
							{isSubmitting ? "Creating workspace…" : "Create workspace"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export { CreateWorkspaceDialog };
