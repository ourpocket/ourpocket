import { CardSend, Chart21, Cloud, Code, DocumentText, Home, Key } from "iconsax-reactjs";
import { type ReactNode } from "react";

export interface SidebarItem {
	icon: ReactNode;
	label: string;
	href?: string;
	subItems?: Omit<SidebarItem, "icon" | "subItems">[];
}

export const mainMenuItems: SidebarItem[] = [
	{
		icon: <Home size={20} />,
		label: "Overview",
		href: "/dashboard",
	},
	{
		icon: <Key size={20} />,
		label: "API Keys",
		href: "/api-keys",
	},
	{
		icon: <CardSend size={20} />,
		label: "Transactions",
		href: "/transactions",
	},
	{
		icon: <Cloud size={20} />,
		label: "Providers",
		href: "/providers",
	},
	{
		icon: <DocumentText size={20} />,
		label: "Reconciliation",
		href: "/reconciliation",
	},
	{
		icon: <Code size={20} />,
		label: "Webhooks",
		href: "/webhooks",
	},
];

export const accountMenuItems: SidebarItem[] = [];

export const supportMenuItems: SidebarItem[] = [];
