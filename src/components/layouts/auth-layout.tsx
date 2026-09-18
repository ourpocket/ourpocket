import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, GitBranch, ShieldCheck, WalletCards } from "lucide-react";
import { LogoText } from "../micro/logo";

interface IAuthLayout {
	children: React.ReactNode;
	title?: string;
	description?: string;
	isCentered?: boolean;
	icon?: React.ReactNode;
}

const AuthLayout = ({ children, title, description, icon }: IAuthLayout) => {
	return (
		<main className="min-h-dvh bg-[#171717] text-white selection:bg-[#fb8a2e] selection:text-[#171717]">
			<header className="flex h-20 items-center justify-between border-b border-[#2d2d2d] px-5 sm:px-8 lg:px-12">
				<LogoText size={146} className="h-auto w-[138px]" />
				<Link
					to="/"
					className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fb8a2e]"
				>
					<ArrowLeft className="size-4" /> Back home
				</Link>
			</header>

			<div className="grid min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)]">
				<section className="relative hidden overflow-hidden border-r border-[#2d2d2d] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
					<div className="max-w-xl">
						<p className="mb-7 font-mono text-xs uppercase tracking-[0.18em] text-[#fb8a2e]">
							OurPocket infrastructure
						</p>
						<h1 className="text-balance text-5xl font-medium leading-[1.03] tracking-[-0.045em] xl:text-6xl">
							Build wallets without inheriting provider complexity.
						</h1>
						<p className="mt-7 max-w-lg text-base leading-7 text-zinc-400">
							One account gives your team a consistent API for wallet creation, transfers,
							transaction events, and provider routing.
						</p>
					</div>

					<div className="relative max-w-xl border border-[#343434] bg-[#1c1c1c]">
						<div className="flex items-center justify-between border-b border-[#343434] px-5 py-4 font-mono text-xs text-zinc-500">
							<span>request.pipeline</span>
							<span className="text-emerald-400">LIVE</span>
						</div>
						<div className="space-y-0 px-5">
							<div className="flex items-center justify-between border-b border-[#303030] py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<WalletCards className="size-4 text-[#fb8a2e]" />
									Wallet request
								</span>
								<span className="font-mono text-xs text-zinc-500">RECEIVED</span>
							</div>
							<div className="flex items-center justify-between border-b border-[#303030] py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<GitBranch className="size-4 text-[#fb8a2e]" />
									Provider route
								</span>
								<span className="font-mono text-xs text-zinc-500">SELECTED</span>
							</div>
							<div className="flex items-center justify-between py-5">
								<span className="flex items-center gap-3 text-sm text-zinc-300">
									<ShieldCheck className="size-4 text-[#fb8a2e]" />
									Ledger event
								</span>
								<span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
									<Check className="size-3.5" />
									COMMITTED
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className="flex items-start justify-center px-5 py-12 sm:px-8 sm:py-16 lg:items-center lg:px-12">
					<div className="w-full max-w-[30rem]">
						{icon && (
							<div className="mb-7 flex size-12 items-center justify-center border border-[#343434] bg-[#1c1c1c]">
								{icon}
							</div>
						)}
						<div className="mb-9">
							<h2 className="text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">
								{title}
							</h2>
							{description && (
								<p className="mt-3 max-w-md text-[15px] leading-6 text-zinc-400">{description}</p>
							)}
						</div>
						<div className="[&_form]:space-y-5 [&_label]:text-sm [&_label]:font-medium [&_label]:text-zinc-300 [&_input]:h-12 [&_input]:rounded-md [&_input]:border-[#343434] [&_input]:bg-[#1c1c1c] [&_input]:px-4 [&_input]:text-white [&_input]:shadow-none [&_input]:placeholder:text-zinc-600 [&_input]:focus-visible:border-[#fb8a2e] [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-[#fb8a2e] [&_[data-slot=form-message]]:text-xs [&_[data-slot=form-message]]:text-red-400 [&_button[type=submit]]:mt-2 [&_button[type=submit]]:h-12 [&_button[type=submit]]:w-full [&_button[type=submit]]:rounded-md [&_button[type=submit]]:bg-[#fb8a2e] [&_button[type=submit]]:font-semibold [&_button[type=submit]]:text-[#171717] [&_button[type=submit]]:shadow-none [&_button[type=submit]]:transition-colors [&_button[type=submit]]:hover:bg-[#ff9d4d] [&_button[type=submit]]:focus-visible:ring-[#fb8a2e] [&_button[type=submit]]:disabled:bg-[#5b3b24] [&_button[type=submit]]:disabled:text-zinc-400">
							{children}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};

export default AuthLayout;
