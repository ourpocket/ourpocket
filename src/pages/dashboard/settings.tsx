import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useDashboardPlatformAccount } from "@/components/layouts/platform-account-context";
import { ModularCard } from "@/components/module/card";
import { LogoutModal } from "@/components/modules/logout-modal";
import { DashboardSkeleton } from "@/components/modules/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useCurrentProject } from "@/hooks/use-current-project";
import {
	getReducedMotionPreference,
	setReducedMotionPreference,
} from "@/lib/dashboard-preferences";
import { setEnvironment } from "@/lib/environment";
import { clearAuthToken } from "@/lib/session";
import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, KeyRound, LogOut, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";

function SettingRow({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<div className="flex flex-col gap-4 border-b border-white/[0.07] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0">
				<Typography variant="subheading">{title}</Typography>
				<Typography variant="bodySmall" className="mt-1 max-w-xl">
					{description}
				</Typography>
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}

function SettingsContent() {
	const navigate = useNavigate();
	const { platformAccount } = useDashboardPlatformAccount();
	const { environment, isLoading, project } = useCurrentProject();
	const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference);
	const [logoutOpen, setLogoutOpen] = useState(false);

	if (isLoading || !project) {
		return <DashboardSkeleton />;
	}

	const updateReducedMotion = (enabled: boolean) => {
		setReducedMotion(enabled);
		setReducedMotionPreference(enabled);
	};

	const logout = async () => {
		clearAuthToken();
		await navigate({ to: "/auth/login" });
	};

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.7fr)]">
			<div className="space-y-6">
				<ModularCard
					title={
						<span className="flex items-center gap-2">
							<Building2 className="size-4 text-orange-300" aria-hidden="true" />
							Workspace
						</span>
					}
					description="Account and organization information"
					content
				>
					<div className="grid gap-5 sm:grid-cols-2">
						<div>
							<Typography variant="label">Workspace name</Typography>
							<Typography className="mt-1 text-white/80">{platformAccount.name}</Typography>
						</div>
						<div>
							<Typography variant="label">Company</Typography>
							<Typography className="mt-1 text-white/80">
								{platformAccount.companyName || "Not provided"}
							</Typography>
						</div>
						<div>
							<Typography variant="label">Workspace ID</Typography>
							<Typography className="mt-1 break-all font-mono text-xs text-white/60">
								{platformAccount.id}
							</Typography>
						</div>
						<div>
							<Typography variant="label">Created</Typography>
							<Typography className="mt-1 text-white/80">
								{new Date(platformAccount.createdAt).toLocaleDateString()}
							</Typography>
						</div>
					</div>
				</ModularCard>

				<ModularCard
					title={
						<span className="flex items-center gap-2">
							<SlidersHorizontal className="size-4 text-orange-300" aria-hidden="true" />
							Developer preferences
						</span>
					}
					description="Preferences stored for this browser"
					content
				>
					<SettingRow
						title="Active environment"
						description="Controls which project records, connections, events and logs appear across the dashboard."
					>
						<Label className="sr-only" htmlFor="settings-environment">
							Active environment
						</Label>
						<Select value={environment} onValueChange={setEnvironment}>
							<SelectTrigger id="settings-environment" className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sandbox">Sandbox</SelectItem>
								<SelectItem value="production">Production</SelectItem>
							</SelectContent>
						</Select>
					</SettingRow>
					<SettingRow
						title="Reduce motion"
						description="Minimizes interface animation and transition effects on this browser."
					>
						<Switch
							checked={reducedMotion}
							onCheckedChange={updateReducedMotion}
							aria-label="Reduce motion"
						/>
					</SettingRow>
				</ModularCard>
			</div>

			<div className="space-y-6">
				<ModularCard title="Active project" description="Current dashboard context" content>
					<Typography variant="heading">{project.name}</Typography>
					<Typography className="mt-1">
						{project.description || "No project description"}
					</Typography>
					<div className="mt-5 rounded-lg border border-white/[0.07] bg-black/15 p-4">
						<Typography variant="caption">PROJECT SLUG</Typography>
						<Typography className="mt-1 font-mono text-xs text-white/65">{project.slug}</Typography>
					</div>
					<div className="mt-4 grid gap-2">
						<Button asChild variant="outline" className="justify-start !bg-transparent">
							<Link to="/dashboard/api-key">
								<KeyRound className="size-4" aria-hidden="true" />
								Manage API keys
							</Link>
						</Button>
						<Button asChild variant="outline" className="justify-start !bg-transparent">
							<Link to="/dashboard/wallet-providers">Manage provider connections</Link>
						</Button>
					</div>
				</ModularCard>

				<ModularCard title="Session" description="Security controls for this browser" content>
					<Typography>
						Logging out removes the current session and selected project from this browser.
					</Typography>
					<Button
						type="button"
						variant="outline"
						className="mt-5 border-red-500/20 !bg-red-500/[0.06] text-red-200 hover:!bg-red-500/10"
						onClick={() => setLogoutOpen(true)}
					>
						<LogOut className="size-4" aria-hidden="true" />
						Log out
					</Button>
				</ModularCard>
			</div>

			<LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} onConfirm={() => void logout()} />
		</div>
	);
}

function SettingsPage() {
	return (
		<DashboardLayout
			title="Settings"
			description="Manage workspace context and dashboard preferences."
		>
			<SettingsContent />
		</DashboardLayout>
	);
}

export default SettingsPage;
