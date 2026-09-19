import { Typography } from "@/components/ui/typography";
import { Braces, Eye, ShieldCheck } from "lucide-react";

const reasons = [
	{
		icon: Braces,
		title: "Ship against one contract",
		body: "Keep checkout, verification, refunds, and provider operations behind a clear API boundary while your product grows.",
	},
	{
		icon: ShieldCheck,
		title: "Test without provider setup",
		body: "Use Sandbox to exercise success, failure, pending, timeout, and insufficient-funds paths before a live credential exists.",
	},
	{
		icon: Eye,
		title: "Keep control of your data",
		body: "Production provider responses are returned for the request and discarded. Your application keeps the references it needs.",
	},
] as const;

export function DeveloperReasons() {
	return (
		<section id="why-ourpocket" className="developer-reasons landing-shell">
			<div className="developer-reasons-intro">
				<Typography as="p" variant="label" className="developer-reasons-kicker">
					Why developers choose OurPocket
				</Typography>
				<Typography as="h2" variant="display" className="developer-reasons-title">
					Move faster without handing over your financial control.
				</Typography>
			</div>
			<div className="developer-reasons-list">
				{reasons.map((reason, index) => {
					const Icon = reason.icon;
					return (
						<article className="developer-reason" key={reason.title}>
							<div className="developer-reason-topline">
								<Typography as="span" variant="caption">
									0{index + 1}
								</Typography>
								<Icon aria-hidden="true" size={19} strokeWidth={1.75} />
							</div>
							<Typography as="h3" variant="heading" className="developer-reason-title">
								{reason.title}
							</Typography>
							<Typography className="developer-reason-copy">{reason.body}</Typography>
						</article>
					);
				})}
			</div>
		</section>
	);
}
