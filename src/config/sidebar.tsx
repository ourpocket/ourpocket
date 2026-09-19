import type { SidebarItem } from "@/components/module/dashboard/sidebar";
import {
	CardSend,
	Cloud,
	Code,
	DocumentText,
	Home,
	Key,
	Setting2,
	WalletAdd,
} from "iconsax-reactjs";

export const mainMenuItems: SidebarItem[] = [
	{
		icon: <Home size={20} variant={"Bold"} />,
		label: "Overview",
		href: "/dashboard",
		isActive: <Home size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <Key size={20} variant={"Bulk"} />,
		label: "API Keys",
		href: "/dashboard/api-key",
		isActive: <Key size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <DocumentText size={20} variant={"Bulk"} />,
		label: "Projects",
		href: "/dashboard/projects",
		isActive: <DocumentText size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <WalletAdd size={20} variant={"Bulk"} />,
		label: "Wallets",
		href: "/dashboard/wallets",
		isActive: <WalletAdd size={20} variant={"Bold"} color={"orange"} />,
	},

	{
		icon: <Cloud size={20} variant={"Bulk"} />,
		label: "Providers",
		href: "/dashboard/wallet-providers",
		isActive: <Cloud size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <Code size={20} variant={"Bulk"} />,
		label: "Webhooks",
		href: "/dashboard/webhooks",
		isActive: <Code size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <CardSend size={20} variant={"Bulk"} />,
		label: "Transactions",
		href: "/dashboard/transactions",
		isActive: <CardSend size={20} variant={"Bold"} color={"orange"} />,
	},
	{
		icon: <Code size={20} variant="Bulk" />,
		label: "API Logs",
		href: "/dashboard/api-logs",
		isActive: <Code size={20} variant="Bold" color="orange" />,
	},
];

export const accountMenuItems: SidebarItem[] = [
	{
		icon: <Setting2 size={20} variant="Bulk" />,
		label: "Settings",
		href: "/dashboard/settings",
		isActive: <Setting2 size={20} variant="Bold" color="orange" />,
	},
];

export const supportMenuItems: SidebarItem[] = [];
