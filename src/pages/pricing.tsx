import { DeveloperCta } from "@/components/module/landing/developer-cta";
import { LandingHeader } from "@/components/module/landing/landing-header";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import "@/components/module/landing/landing.css";
import "../../tokens.css";

const plans = [
	{
		name: "Developer",
		price: "$0",
		description: "Build the complete financial flow with deterministic provider simulators.",
		features: [
			"Simulated payments and refunds",
			"Fiat wallets, balances and transfers",
			"Success, failure, pending and outage scenarios",
			"Events, API logs and signed test webhooks",
		],
		cta: "Start building",
		featured: false,
	},
	{
		name: "Launch",
		price: "$3",
		description: "Connect one production payment rail and ship your first live flow.",
		features: [
			"Everything in Developer",
			"One production provider",
			"Hosted checkout and refunds",
			"Signed webhooks and API logs",
		],
		cta: "Start launching",
		featured: false,
	},
	{
		name: "Growth",
		price: "$6",
		description: "Operate multiple payment and wallet providers from one control plane.",
		features: [
			"Everything in Launch",
			"Payments with Paystack and Flutterwave",
			"Wallets with Turnkey and Privy",
			"Auditable routing and reconciliation",
			"Delivery history and replay",
		],
		cta: "Choose Growth",
		featured: true,
	},
	{
		name: "Enterprise",
		price: "$6",
		description: "Bring higher-volume teams into the same policy and operations model.",
		features: [
			"Everything in Growth",
			"Multiple production projects",
			"Provider health policies",
			"Extended operational support",
		],
		cta: "Contact us",
		featured: false,
	},
] as const;

function PricingPage() {
	return (
		<main className="landing-page min-h-screen bg-[#171717]">
			<LandingHeader />
			<section className="landing-shell px-5 py-20 sm:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<Typography
						as="span"
						variant="label"
						className="inline-flex rounded-full border border-orange-300/20 bg-orange-400/[0.08] px-3 py-1.5 text-orange-200"
					>
						Simple pricing
					</Typography>
					<Typography variant="display" className="mt-6 text-4xl sm:text-6xl">
						Start in Sandbox. Ship for $6.
					</Typography>
					<Typography className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">
						Build the complete financial flow without provider credentials. Upgrade when you are
						ready to connect production payment and wallet infrastructure.
					</Typography>
				</div>

				<div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
					{plans.map((plan) => (
						<article
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border p-7 sm:p-8 ${
								plan.featured
									? "border-orange-300/30 bg-orange-400/[0.055]"
									: "border-white/[0.09] bg-[#1b1b1b]"
							}`}
						>
							{plan.featured && (
								<Typography
									as="span"
									variant="caption"
									className="absolute top-5 right-5 inline-flex items-center gap-1 text-orange-200"
								>
									<Sparkles className="size-3.5" aria-hidden="true" />
									PRODUCTION
								</Typography>
							)}
							<Typography variant="heading">{plan.name}</Typography>
							<div className="mt-5 flex items-end gap-2">
								<Typography as="span" variant="display" className="text-5xl">
									{plan.price}
								</Typography>
								<Typography as="span" className="pb-1">
									{plan.price === "$0" ? "forever" : "per month"}
								</Typography>
							</div>
							<Typography className="mt-5 min-h-12">{plan.description}</Typography>
							<div className="my-7 h-px bg-white/[0.07]" />
							<ul className="flex-1 space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-3">
										<Check className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
										<Typography as="span" className="text-white/65">
											{feature}
										</Typography>
									</li>
								))}
							</ul>
							<Button
								asChild
								className={plan.featured ? "mt-8" : "mt-8 !bg-white text-black hover:!bg-white/90"}
							>
								<Link to="/auth/register">{plan.cta}</Link>
							</Button>
						</article>
					))}
				</div>

				<Typography className="mx-auto mt-8 max-w-2xl text-center text-white/40">
					Provider processing fees are billed by each connected provider. OurPocket keeps the
					control plane predictable at no more than $6 per month.
				</Typography>
			</section>
			<DeveloperCta />
		</main>
	);
}

export default PricingPage;
