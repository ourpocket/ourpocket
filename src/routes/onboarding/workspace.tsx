import { getSafeDashboardReturnPath } from "@/lib/onboarding";
import { WorkspaceOnboarding } from "@/pages/onboarding/workspace";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const workspaceOnboardingSearchSchema = z
	.object({
		returnTo: z.string().optional(),
	})
	.transform(({ returnTo }) => ({ returnTo: getSafeDashboardReturnPath(returnTo) }));

export const Route = createFileRoute("/onboarding/workspace")({
	validateSearch: workspaceOnboardingSearchSchema,
	component: WorkspaceOnboardingRoute,
});

function WorkspaceOnboardingRoute() {
	const { returnTo } = Route.useSearch();

	return <WorkspaceOnboarding returnTo={returnTo} />;
}
