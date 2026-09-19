import ApiLogsPage from "@/pages/dashboard/api-logs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/api-logs")({ component: ApiLogsPage });
