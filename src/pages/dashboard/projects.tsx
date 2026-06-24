import DashboardLayout from "@/components/layouts/dashboard-layout";
import { ModularCard } from "@/components/module/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePlatformAccount } from "@/hooks/use-platform-account";
import { useProjects } from "@/hooks/use-projects";
import { setStoredProjectId } from "@/lib/session";
import type { PlatformAccount, Project } from "@/services/types";
import moment from "moment";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

const ProjectsPage = () => {
	const { getMyPlatformAccount } = usePlatformAccount();
	const { createProject, getProject, isLoading, listProjects } = useProjects();
	const [platformAccount, setPlatformAccount] = useState<PlatformAccount | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [form, setForm] = useState({
		name: "",
		slug: "",
		description: "",
	});

	useEffect(() => {
		let isMounted = true;

		async function load() {
			const [account, projectList] = await Promise.all([getMyPlatformAccount(), listProjects()]);

			if (isMounted) {
				setPlatformAccount(account);
				setProjects(projectList);
			}
		}

		void load();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const project = await createProject({
			name: form.name,
			slug: form.slug || undefined,
			description: form.description || undefined,
		});
		setProjects((current) => [project, ...current]);
		setForm({ name: "", slug: "", description: "" });
		toast.success("Project created");
	};

	const handleSelectProject = async (projectId: string) => {
		const project = await getProject(projectId);
		setStoredProjectId(project.id);
		setSelectedProject(project);
		toast.success(`${project.name} selected`);
	};

	return (
		<DashboardLayout title="Projects" description="Manage organization projects">
			<div className="grid grid-cols-1 gap-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ModularCard title="Organization" content>
						<div className="space-y-2 text-sm text-gray-300">
							<p>{platformAccount?.name ?? "No organization loaded"}</p>
							<p>{platformAccount?.companyName ?? "No company name"}</p>
							{platformAccount && <Badge>{platformAccount.id}</Badge>}
						</div>
					</ModularCard>

					<ModularCard title="Create Project" content>
						<form onSubmit={handleCreateProject} className="space-y-3">
							<Input
								value={form.name}
								onChange={(event) => setForm({ ...form, name: event.target.value })}
								placeholder="Project name"
								required
							/>
							<Input
								value={form.slug}
								onChange={(event) => setForm({ ...form, slug: event.target.value })}
								placeholder="project-slug"
							/>
							<Input
								value={form.description}
								onChange={(event) => setForm({ ...form, description: event.target.value })}
								placeholder="Description"
							/>
							<Button type="submit" disabled={isLoading}>
								Create Project
							</Button>
						</form>
					</ModularCard>
				</div>

				<ModularCard title="Project List" content>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Slug</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{projects.map((project) => (
								<TableRow key={project.id}>
									<TableCell>{project.name}</TableCell>
									<TableCell>{project.slug}</TableCell>
									<TableCell>{moment(project.createdAt).format("MMM D, YYYY")}</TableCell>
									<TableCell>
										<Button
											className="bg-gray-700/20"
											onClick={() => handleSelectProject(project.id)}
										>
											Use Project
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ModularCard>

				{selectedProject && (
					<ModularCard title="Selected Project" content>
						<pre className="overflow-auto rounded-md bg-black/30 p-4 text-xs text-gray-200">
							{JSON.stringify(selectedProject, null, 2)}
						</pre>
					</ModularCard>
				)}
			</div>
		</DashboardLayout>
	);
};

export default ProjectsPage;
