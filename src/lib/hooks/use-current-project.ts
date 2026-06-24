import { type Project, ensureDefaultProject } from "@/lib/api";
import { getAuthToken } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useCurrentProject() {
	const navigate = useNavigate();
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
				const currentProject = await ensureDefaultProject();
				if (isMounted) {
					setProject(currentProject);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load project";
				toast.error(message);
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
	}, [navigate]);

	return {
		project,
		isLoading,
	};
}

export { useCurrentProject };
