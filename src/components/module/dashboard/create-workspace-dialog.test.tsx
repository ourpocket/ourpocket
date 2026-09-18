import { ApiError } from "@/services/api-client";
import type { PlatformAccount } from "@/services/types";
import {
	Outlet,
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

interface RenderDialogOptions {
	createWorkspace?: (input: { name: string; companyName?: string }) => Promise<PlatformAccount>;
	onCreated?: (platformAccount: PlatformAccount) => void;
	onConflict?: () => Promise<void>;
}

const noOpConflict = async () => {};

async function renderDialog({
	createWorkspace = vi.fn(),
	onCreated = vi.fn(),
	onConflict = noOpConflict,
}: RenderDialogOptions = {}) {
	const rootRoute = createRootRoute({
		component: Outlet,
	});

	const dialogRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => (
			<CreateWorkspaceDialog
				open
				createWorkspace={createWorkspace}
				onCreated={onCreated}
				onConflict={onConflict}
			/>
		),
	});

	const router = createRouter({
		routeTree: rootRoute.addChildren([dialogRoute]),
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});

	render(<RouterProvider router={router} />);
	await act(async () => {
		await router.load();
	});

	return { createWorkspace, onCreated, onConflict };
}

describe("CreateWorkspaceDialog", () => {
	const platformAccount = {
		id: "workspace-id",
		name: "Acme Payments",
		companyName: "Acme Financial Technologies",
		createdAt: "2026-09-18T00:00:00.000Z",
	};

	it("requires a workspace name before creating an account", async () => {
		const createWorkspace = vi.fn();
		await renderDialog({ createWorkspace });

		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		expect(screen.getByRole("alert").textContent).toBe("Enter a workspace name to continue.");
		expect(createWorkspace).not.toHaveBeenCalled();
	});

	it("creates the workspace and returns it to the dashboard", async () => {
		const user = userEvent.setup();
		const createWorkspace = vi.fn().mockResolvedValue(platformAccount);
		const { onCreated } = await renderDialog({ createWorkspace });

		await user.type(screen.getByLabelText("Workspace name"), platformAccount.name);
		await user.type(screen.getByLabelText(/Company name/), platformAccount.companyName);
		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		await waitFor(() => {
			expect(createWorkspace).toHaveBeenCalledWith({
				name: platformAccount.name,
				companyName: platformAccount.companyName,
			});
			expect(onCreated).toHaveBeenCalledWith(platformAccount);
		});
	});

	it("refetches the account after a concurrent creation conflict", async () => {
		const user = userEvent.setup();
		const onConflict = vi.fn().mockResolvedValue(undefined);

		const createWorkspace = vi
			.fn()
			.mockRejectedValue(new ApiError("Platform account already exists for user", 409));

		await renderDialog({ createWorkspace, onConflict });

		await user.type(screen.getByLabelText("Workspace name"), platformAccount.name);
		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		await waitFor(() => {
			expect(onConflict).toHaveBeenCalledOnce();
		});
	});
});
