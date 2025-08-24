import {
	CardSend,
	Chart21,
	Cloud,
	Code,
	DocumentText,
	Home,
	Key,
	WalletAdd,
} from "iconsax-reactjs";
import { type ReactNode } from "react";

export interface SidebarItem {
	icon: ReactNode;
	label: string;
	href?: string;
	subItems?: Omit<SidebarItem, "icon" | "subItems">[];
	isActive?: ReactNode;
}

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
		icon: <WalletAdd size={20} variant={"Bulk"} />,
		label: "Wallet",
		href: "/dashboard/user-wallet",
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
	// {
	//   icon: <CardSend size={20} variant={"Bulk"} />,
	//   label: "Transactions",
	//   href: "/dashboard/transactions",
	//   isActive: <CardSend size={20} variant={"Bold"} color={"orange"} />,
	// },
	// {
	//   icon: <DocumentText size={20} variant={"Bulk"} />,
	//   label: "Reconciliation",
	//   href: "/reconciliation",
	//   isActive: <DocumentText size={20} variant={"Bold"} color={"orange"} />,
	// },
];

export const accountMenuItems: SidebarItem[] = [];

export const supportMenuItems: SidebarItem[] = [];
