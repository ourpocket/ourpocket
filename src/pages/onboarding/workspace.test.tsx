import { ApiError } from "@/services/api-client";
import type { PlatformAccount } from "@/services/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceSetupForm } from "./workspace";

interface RenderFormOptions {
	createWorkspace?: (input: { name: string; companyName?: string }) => Promise<PlatformAccount>;
	onCreated?: () => Promise<void>;
	onConflict?: () => Promise<void>;
}

function renderWorkspaceForm({
	createWorkspace = vi.fn(),
	onCreated = async () => {},
	onConflict = async () => {},
}: RenderFormOptions = {}) {
	render(
		<WorkspaceSetupForm
			createWorkspace={createWorkspace}
			onCreated={onCreated}
			onConflict={onConflict}
		/>,
	);

	return { createWorkspace, onCreated, onConflict };
}

describe("WorkspaceSetupForm", () => {
	const platformAccount = {
		id: "workspace-id",
		name: "Acme Payments",
		companyName: "Acme Financial Technologies",
		createdAt: "2026-09-18T00:00:00.000Z",
	};

	it("requires a workspace name before creating an account", () => {
		const createWorkspace = vi.fn();
		renderWorkspaceForm({ createWorkspace });

		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		expect(screen.getByRole("alert").textContent).toBe("Enter a workspace name to continue.");
		expect(createWorkspace).not.toHaveBeenCalled();
	});

	it("creates the workspace and continues to the dashboard", async () => {
		const user = userEvent.setup();
		const createWorkspace = vi.fn().mockResolvedValue(platformAccount);
		const onCreated = vi.fn().mockResolvedValue(undefined);
		renderWorkspaceForm({ createWorkspace, onCreated });

		await user.type(screen.getByLabelText("Workspace name"), platformAccount.name);
		await user.type(screen.getByLabelText(/Company name/), platformAccount.companyName);
		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		await waitFor(() => {
			expect(createWorkspace).toHaveBeenCalledWith({
				name: platformAccount.name,
				companyName: platformAccount.companyName,
			});
			expect(onCreated).toHaveBeenCalledOnce();
		});
	});

	it("rechecks the workspace after a concurrent creation conflict", async () => {
		const user = userEvent.setup();

		const createWorkspace = vi
			.fn()
			.mockRejectedValue(new ApiError("Platform account already exists for user", 409));

		const onConflict = vi.fn().mockResolvedValue(undefined);
		renderWorkspaceForm({ createWorkspace, onConflict });

		await user.type(screen.getByLabelText("Workspace name"), platformAccount.name);
		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		await waitFor(() => {
			expect(onConflict).toHaveBeenCalledOnce();
		});
	});

	it("shows an actionable error when workspace creation fails", async () => {
		const user = userEvent.setup();
		const createWorkspace = vi.fn().mockRejectedValue(new Error("Service temporarily unavailable"));
		renderWorkspaceForm({ createWorkspace });

		await user.type(screen.getByLabelText("Workspace name"), platformAccount.name);
		fireEvent.submit(screen.getByRole("button", { name: "Create workspace" }).closest("form")!);

		await waitFor(() => {
			expect(screen.getByRole("alert").textContent).toBe("Service temporarily unavailable");
		});
		expect(screen.getByRole("button", { name: "Create workspace" }).hasAttribute("disabled")).toBe(
			false,
		);
	});
});
