import { useServiceAction } from "@/hooks/use-service-action";
import * as projectService from "@/services/project.service";

function useProjects() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		listProjects: () => run(() => projectService.listProjects()),
		getProject: (projectId: string) => run(() => projectService.getProject(projectId)),
		createProject: (payload: {
			name: string;
			description?: string;
			metadata?: Record<string, unknown>;
		}) => run(() => projectService.createProject(payload)),
		getSelectedProject: () => run(() => projectService.getSelectedProject()),
	};
}

export { useProjects };
