import SettingsPage from "@/pages/dashboard/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingsPage,
});
