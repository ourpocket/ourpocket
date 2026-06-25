import DashboardLayout from "@/components/layouts/dashboard-layout";
import ModularModals from "@/components/module/popovers/modular-modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePlatformAccount } from "@/hooks/use-platform-account";
import { useProjects } from "@/hooks/use-projects";
import { getStoredProjectId, setStoredProjectId } from "@/lib/session";
import type { PlatformAccount, Project } from "@/services/types";
import { useNavigate } from "@tanstack/react-router";
import { Box, Plus, Search } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

const CreateProjectForm = ({
	onCreated,
}: {
	onCreated: (project: Project) => void;
}) => {
	const { createProject, isLoading } = useProjects();
	const [form, setForm] = useState({
		name: "",
		description: "",
	});

	const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const project = await createProject({
			name: form.name,
			description: form.description || undefined,
		});
		setStoredProjectId(project.id);
		setForm({ name: "", description: "" });
		onCreated(project);
		toast.success("Project created");
	};

	return (
		<form onSubmit={handleCreateProject} className="space-y-3">
			<Input
				value={form.name}
				onChange={(event) => setForm({ ...form, name: event.target.value })}
				placeholder="Project name"
				required
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
	);
};

const ProjectsPage = () => {
	const navigate = useNavigate();
	const { getMyPlatformAccount } = usePlatformAccount();
	const { getProject, listProjects } = useProjects();
	const [platformAccount, setPlatformAccount] = useState<PlatformAccount | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [sort, setSort] = useState("newest");
	const hasProjects = projects.length > 0;

	useEffect(() => {
		let isMounted = true;

		async function load() {
			const [account, projectList] = await Promise.all([getMyPlatformAccount(), listProjects()]);
			const storedProjectId = getStoredProjectId();
			const currentProject = projectList.find((project) => project.id === storedProjectId) ?? null;

			if (isMounted) {
				setPlatformAccount(account);
				setProjects(projectList);
				setSelectedProject(currentProject);
			}
		}

		void load();

		return () => {
			isMounted = false;
		};
	}, []);

	const filteredProjects = useMemo(() => {
		return projects
			.filter((project) => {
				const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase());
				const matchesStatus = status === "all" || project.id === selectedProject?.id;
				return matchesSearch && matchesStatus;
			})
			.sort((first, second) => {
				if (sort === "name") {
					return first.name.localeCompare(second.name);
				}

				return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
			});
	}, [projects, search, selectedProject?.id, sort, status]);

	const handleCreated = (project: Project) => {
		setProjects((current) => [project, ...current]);
		setSelectedProject(project);
		void navigate({ to: "/dashboard" });
	};

	const handleSelectProject = async (projectId: string) => {
		const project = await getProject(projectId);
		setStoredProjectId(project.id);
		setSelectedProject(project);
		toast.success(`${project.name} selected`);
		await navigate({ to: "/dashboard" });
	};

	return (
		<DashboardLayout
			title="Projects"
			description={platformAccount?.name ?? "Manage organization projects"}
		>
			<div className="space-y-5">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-1 flex-col gap-3 md:flex-row">
						<div className="relative w-full md:max-w-sm">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
							<Input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search for a project"
								className="pl-9"
							/>
						</div>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="w-full md:w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All projects</SelectItem>
								<SelectItem value="selected">Selected</SelectItem>
							</SelectContent>
						</Select>
						<Select value={sort} onValueChange={setSort}>
							<SelectTrigger className="w-full md:w-[180px]">
								<SelectValue placeholder="Sort" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Sorted by newest</SelectItem>
								<SelectItem value="name">Sorted by name</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<ModularModals
						trigger={
							<Button>
								<Plus className="h-4 w-4" />
								New project
							</Button>
						}
					>
						<div className="mb-4">
							<h4 className="text-lg font-semibold text-white">Create project</h4>
							<small className="text-white/70">
								Create a project for your wallet infrastructure
							</small>
						</div>
						<CreateProjectForm onCreated={handleCreated} />
					</ModularModals>
				</div>

				{!hasProjects ? (
					<div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/70 p-8 text-center">
						<Box className="mb-4 h-8 w-8 text-gray-500" />
						<h3 className="text-lg font-semibold text-white">Create a project</h3>
						<p className="mt-2 text-sm text-gray-400">
							Start by creating a project for your wallet infrastructure.
						</p>
						<ModularModals
							trigger={
								<Button className="mt-5">
									<Plus className="h-4 w-4" />
									New project
								</Button>
							}
						>
							<div className="mb-4">
								<h4 className="text-lg font-semibold text-white">Create project</h4>
								<small className="text-white/70">
									Create a project for your wallet infrastructure
								</small>
							</div>
							<CreateProjectForm onCreated={handleCreated} />
						</ModularModals>
					</div>
				) : (
					<div className="rounded-xl border bg-card text-white">
						{filteredProjects.map((project) => {
							const isSelected = selectedProject?.id === project.id;

							return (
								<div
									key={project.id}
									className="flex flex-col gap-4 border-b border-white/10 p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
								>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{project.name}</h3>
											{isSelected && <Badge>Selected</Badge>}
										</div>
										<p className="mt-1 text-sm text-gray-400">
											{project.description || "No description"}
										</p>
										<p className="mt-2 text-xs text-gray-500">
											Created {moment(project.createdAt).format("MMM D, YYYY")}
										</p>
									</div>
									<Button
										className="w-fit bg-gray-700/20"
										disabled={isSelected}
										onClick={() => handleSelectProject(project.id)}
									>
										{isSelected ? "Selected" : "Use Project"}
									</Button>
								</div>
							);
						})}

						{filteredProjects.length === 0 && (
							<div className="p-8 text-center text-sm text-gray-400">
								No projects match your filters.
							</div>
						)}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default ProjectsPage;
