import { OnboardingLayout } from "@/components/layouts/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeDashboardReturnPath } from "@/lib/onboarding";
import { getAuthToken } from "@/lib/session";
import { ApiError } from "@/services/api-client";
import { createPlatformAccount, getMyPlatformAccount } from "@/services/platform-account.service";
import type { PlatformAccount } from "@/services/types";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

interface WorkspaceSetupFormProps {
	createWorkspace: (input: { name: string; companyName?: string }) => Promise<PlatformAccount>;
	onCreated: () => Promise<void>;
	onConflict: () => Promise<void>;
}

function WorkspaceSetupForm({ createWorkspace, onCreated, onConflict }: WorkspaceSetupFormProps) {
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
			await createWorkspace({
				name,
				companyName: companyName.trim() || undefined,
			});
			await onCreated();
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

	return (
		<form onSubmit={handleSubmit}>
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
					Company name <span className="text-zinc-500">(optional)</span>
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
				<p role="alert" className="text-sm leading-5 text-red-400">
					{errorMessage}
				</p>
			)}

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
				{isSubmitting ? "Creating workspace…" : "Create workspace"}
			</Button>
		</form>
	);
}

interface WorkspaceOnboardingProps {
	returnTo?: string;
}

function WorkspaceOnboarding({ returnTo }: WorkspaceOnboardingProps) {
	const navigate = useNavigate();
	const dashboardPath = getSafeDashboardReturnPath(returnTo);
	const [status, setStatus] = useState<"checking" | "missing" | "error">("checking");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const continueToDashboard = useCallback(async () => {
		await navigate({ to: dashboardPath, replace: true });
	}, [dashboardPath, navigate]);

	const checkWorkspace = useCallback(async () => {
		setStatus("checking");
		setErrorMessage(null);

		try {
			await getMyPlatformAccount();
			await continueToDashboard();
		} catch (error) {
			if (error instanceof ApiError && error.statusCode === 404) {
				setStatus("missing");

				return;
			}

			setStatus("error");
			setErrorMessage(
				error instanceof Error
					? error.message
					: "We could not check your workspace. Please try again.",
			);
		}
	}, [continueToDashboard]);

	useEffect(() => {
		if (!getAuthToken()) {
			void navigate({ to: "/auth/login", replace: true });

			return;
		}

		void checkWorkspace();
	}, [checkWorkspace, navigate]);

	return (
		<OnboardingLayout
			title="Set up your workspace"
			description="Create the home for your projects, wallet infrastructure, and transaction activity."
		>
			{status === "checking" && (
				<div className="flex min-h-32 items-center gap-3 text-sm text-zinc-400">
					<LoaderCircle className="size-4 animate-spin text-[#fb8a2e]" aria-hidden="true" />
					Checking your workspace…
				</div>
			)}

			{status === "error" && (
				<div className="space-y-5">
					<div className="flex items-start gap-3 text-sm leading-6 text-zinc-400">
						<AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" aria-hidden="true" />
						<p>{errorMessage || "Check your connection and try again."}</p>
					</div>
					<Button type="button" onClick={() => void checkWorkspace()}>
						Try again
					</Button>
				</div>
			)}

			{status === "missing" && (
				<WorkspaceSetupForm
					createWorkspace={createPlatformAccount}
					onCreated={continueToDashboard}
					onConflict={checkWorkspace}
				/>
			)}
		</OnboardingLayout>
	);
}

export { WorkspaceOnboarding, WorkspaceSetupForm };
