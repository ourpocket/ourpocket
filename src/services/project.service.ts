import { getStoredProjectId, setStoredProjectId } from "@/lib/session";
import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type { Project } from "@/services/types";

function listProjects() {
	return apiRequest<Project[]>(API_ROUTES.projects.list);
}

function createProject(payload: {
	name: string;
	slug?: string;
	description?: string;
	metadata?: Record<string, unknown>;
}) {
	return apiRequest<Project>(API_ROUTES.projects.create, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

function getProject(projectId: string) {
	return apiRequest<Project>(API_ROUTES.projects.detail(projectId));
}

async function ensureDefaultProject() {
	const storedProjectId = getStoredProjectId();
	const projects = await listProjects();
	const storedProject = projects.find((project) => project.id === storedProjectId);

	if (storedProject) {
		return storedProject;
	}

	if (projects[0]) {
		setStoredProjectId(projects[0].id);
		return projects[0];
	}

	const project = await createProject({
		name: "Default Project",
		slug: "default-project",
		description: "Main OurPocket integration project",
	});
	setStoredProjectId(project.id);
	return project;
}

export { createProject, ensureDefaultProject, getProject, listProjects };
