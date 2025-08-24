import { LogoText } from "@/components/micro/logo";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { ArrowDown2, Menu } from "iconsax-reactjs";
import { type ReactNode, useState } from "react";

interface SidebarItem {
	icon?: ReactNode;
	label: string;
	href?: string;
	subItems?: Array<{
		label: string;
		href: string;
	}>;
}

interface SidebarSectionProps {
	title: string;
	items: SidebarItem[];
}

interface DashboardSidebarProps {
	mainMenuItems: SidebarItem[];
	accountMenuItems: SidebarItem[];
	supportMenuItems: SidebarItem[];
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
}

const SidebarSection = ({ title, items }: SidebarSectionProps) => (
	<div>
		<h3 className="mb-3 px-4 text-xs font-medium uppercase tracking-wider text-white/50">
			{title}
		</h3>
		<nav className="space-y-1.5">
			{items.map((item, index) => (
				<SidebarItemComponent key={item.href || index} item={item} />
			))}
		</nav>
	</div>
);

const sidebarItemStyles = {
	base: "flex items-center gap-x-3 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out text-white",
	main: "px-4 py-2.5 hover:bg-sidebar-accent/10 [&.active]:bg-sidebar-accent/10 [&.active_icon]:font-bold",
	sub: "px-6 py-2 text-white/70 hover:bg-sidebar-accent/10 [&.active]:bg-sidebar-accent/10 [&.active]:text-white",
};

const SidebarItemLink = ({
	href,
	label,
	icon,
	className,
}: {
	href: string;
	label: string;
	icon?: ReactNode;
	className?: string;
}) => {
	const matchRoute = useMatchRoute();
	const isActive = matchRoute({ to: href });
	return (
		<Link
			to={href}
			preload="intent"
			className={cn(sidebarItemStyles.base, className, isActive && "active")}
		>
			<div className={cn("flex items-center", isActive && "active_icon")}>{icon}</div>
			{label}
		</Link>
	);
};

const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
	const [isOpen, setIsOpen] = useState(false);
	const matchRoute = useMatchRoute();
	const isActive = item.subItems
		? item.subItems.some((subItem) => matchRoute({ to: subItem.href }))
		: item.href
			? matchRoute({ to: item.href })
			: false;

	if (item.subItems) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							sidebarItemStyles.base,
							sidebarItemStyles.main,
							"w-full justify-between",
							isActive && "active",
						)}
					>
						<div className={cn("flex items-center gap-x-3", isActive && "active_icon")}>
							{item.icon}
							{item.label}
						</div>
						<ArrowDown2
							size={16}
							className={cn("text-white/50 transition-transform", isOpen && "rotate-180")}
						/>
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className="space-y-1 px-2 py-1.5">
					{item.subItems.map((subItem) => (
						<SidebarItemLink
							key={subItem.href}
							href={subItem.href}
							label={subItem.label}
							className={sidebarItemStyles.sub}
						/>
					))}
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<SidebarItemLink
			href={item.href!}
			label={item.label}
			icon={item.icon}
			className={sidebarItemStyles.main}
		/>
	);
};

const sidebarStyles = {
	toggleButton: "fixed left-4 top-4 z-50 lg:hidden",
	aside:
		"fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-200 ease-in-out lg:static",
	header: "flex h-16 items-center justify-between border-b px-6",
	content: "flex flex-1 flex-col",
	sections: "flex-1 space-y-6 overflow-y-auto p-6",
};

const DashboardSidebar = ({
	mainMenuItems,
	accountMenuItems,
	supportMenuItems,
	isSidebarOpen,
	setIsSidebarOpen,
}: DashboardSidebarProps) => {
	const sections = [
		{ title: "MAIN MENU", items: mainMenuItems },
		{ title: "ACCOUNT", items: accountMenuItems },
		{ title: "SUPPORT", items: supportMenuItems },
	];

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className={sidebarStyles.toggleButton}
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<Menu className="h-6 w-6" />
			</Button>

			<aside
				className={cn(sidebarStyles.aside, !isSidebarOpen && "-translate-x-full lg:translate-x-0")}
			>
				<div className={sidebarStyles.header}>
					<LogoText size={120} />
				</div>

				<div className={sidebarStyles.content}>
					<div className={sidebarStyles.sections}>
						{sections
							.filter((section) => section.items.length > 0)
							.map((section) => (
								<SidebarSection key={section.title} title={section.title} items={section.items} />
							))}
					</div>
				</div>
			</aside>
		</>
	);
};

export type { SidebarItem, DashboardSidebarProps };
export default DashboardSidebar;
