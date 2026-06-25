import { useErrorHandler } from "@/hooks/use-error-handler";
import { getAuthToken } from "@/lib/session";
import { getSelectedProject } from "@/services/project.service";
import type { Project } from "@/services/types";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function useCurrentProject() {
	const navigate = useNavigate();
	const handleError = useErrorHandler();
	const [project, setProject] = useState<Project | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function loadProject() {
			if (!getAuthToken()) {
				await navigate({ to: "/auth/login" });
				return;
			}

			try {
				const currentProject = await getSelectedProject();
				if (isMounted) {
					setProject(currentProject);
				}

				if (!currentProject) {
					await navigate({ to: "/dashboard/projects" });
				}
			} catch (error) {
				handleError(error);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		void loadProject();

		return () => {
			isMounted = false;
		};
	}, [handleError, navigate]);

	return {
		project,
		isLoading,
	};
}

export { useCurrentProject };
