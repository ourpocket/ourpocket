import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/lib/session";
import { useNavigate } from "@tanstack/react-router";
import { Check, GitBranch, LogOut, ShieldCheck, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { LogoText } from "../micro/logo";

interface OnboardingLayoutProps {
	children: ReactNode;
	title: string;
	description: string;
}

function OnboardingLayout({ children, title, description }: OnboardingLayoutProps) {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		clearAuthToken();
		await navigate({ to: "/auth/login" });
	};

	return (
		<main className="min-h-dvh bg-[#171717] text-white selection:bg-[#fb8a2e] selection:text-[#171717]">
			<header className="flex h-20 items-center justify-between border-b border-[#2d2d2d] px-5 sm:px-8 lg:px-12">
				<LogoText size={146} className="h-auto w-[138px]" />
				<Button
					type="button"
					variant="ghost"
					onClick={() => void handleSignOut()}
					className="min-h-11 gap-2 text-zinc-400 hover:bg-transparent hover:text-white"
				>
					<LogOut className="size-4" aria-hidden="true" />
					Sign out
				</Button>
			</header>

			<div className="grid min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)]">
				<section className="relative hidden overflow-hidden border-r border-[#2d2d2d] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
					<div className="max-w-xl">
						<h1 className="text-balance text-5xl font-medium leading-[1.03] tracking-[-0.04em] xl:text-6xl">
							Build wallet infrastructure your whole team can trust.
						</h1>
						<p className="mt-7 max-w-lg text-base leading-7 text-zinc-400">
							Your workspace is the secure home for projects, API keys, provider connections,
							wallets, and transaction activity.
						</p>
					</div>

					<div className="relative max-w-xl border border-[#343434] bg-[#1c1c1c]">
						<div className="flex items-center justify-between border-b border-[#343434] px-5 py-4 font-mono text-xs text-zinc-500">
							<span>workspace.foundation</span>
							<span className="text-emerald-400">READY</span>
						</div>
						<div className="space-y-0 px-5">
							<div className="flex items-center justify-between border-b border-[#303030] py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<WalletCards className="size-4 text-[#fb8a2e]" aria-hidden="true" />
									Projects
								</span>
								<span className="font-mono text-xs text-zinc-500">ORGANIZED</span>
							</div>
							<div className="flex items-center justify-between border-b border-[#303030] py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<GitBranch className="size-4 text-[#fb8a2e]" aria-hidden="true" />
									Provider connections
								</span>
								<span className="font-mono text-xs text-zinc-500">CONNECTED</span>
							</div>
							<div className="flex items-center justify-between py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<ShieldCheck className="size-4 text-[#fb8a2e]" aria-hidden="true" />
									Transaction activity
								</span>
								<span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
									<Check className="size-3.5" aria-hidden="true" />
									SECURE
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className="flex items-start justify-center px-5 py-12 sm:px-8 sm:py-16 lg:items-center lg:px-12">
					<div className="w-full max-w-[30rem]">
						<div className="mb-9">
							<h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
								{title}
							</h2>
							<p className="mt-3 max-w-md text-[15px] leading-6 text-zinc-400">{description}</p>
						</div>
						<div className="[&_form]:space-y-5 [&_label]:text-sm [&_label]:font-medium [&_label]:text-zinc-300 [&_input]:h-12 [&_input]:rounded-md [&_input]:border-[#343434] [&_input]:bg-[#1c1c1c] [&_input]:px-4 [&_input]:text-white [&_input]:shadow-none [&_input]:placeholder:text-zinc-600 [&_input]:focus-visible:border-[#fb8a2e] [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-[#fb8a2e] [&_button[type=submit]]:mt-2 [&_button[type=submit]]:h-12 [&_button[type=submit]]:w-full [&_button[type=submit]]:rounded-md [&_button[type=submit]]:bg-[#fb8a2e] [&_button[type=submit]]:font-semibold [&_button[type=submit]]:text-[#171717] [&_button[type=submit]]:shadow-none [&_button[type=submit]]:transition-colors [&_button[type=submit]]:hover:bg-[#ff9d4d] [&_button[type=submit]]:focus-visible:ring-[#fb8a2e] [&_button[type=submit]]:disabled:bg-[#5b3b24] [&_button[type=submit]]:disabled:text-zinc-400">
							{children}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

export { OnboardingLayout };
