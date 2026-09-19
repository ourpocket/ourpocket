import { clearStoredProjectId, getStoredProjectId } from "@/lib/session";
import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { Project } from "@/services/types";

function listProjects() {
	return apiRequest<Project[]>(API_ROUTES.projects.list);
}

function createProject(payload: {
	name: string;
	description?: string;
	metadata?: Record<string, unknown>;
}) {
	return apiRequest<Project & { sandboxKey: string }>(API_ROUTES.projects.create, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function getProject(projectId: string) {
	return apiRequest<Project>(API_ROUTES.projects.detail(projectId));
}

async function getSelectedProject() {
	const storedProjectId = getStoredProjectId();
	if (!storedProjectId) {
		return null;
	}

	const projects = await listProjects();
	const storedProject = projects.find((project) => project.id === storedProjectId);

	if (storedProject) {
		return storedProject;
	}

	clearStoredProjectId();
	return null;
}

export { createProject, getProject, getSelectedProject, listProjects };
