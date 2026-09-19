import { Typography } from "@/components/ui/typography";
import { CheckCircle2, Code2, Route, Webhook } from "lucide-react";

const steps = [
	{
		icon: Code2,
		title: "Start in Sandbox",
		text: "Create a project and test realistic financial scenarios without provider credentials.",
		detail: "No real money",
	},
	{
		icon: Route,
		title: "Connect production",
		text: "Add encrypted Paystack or Flutterwave credentials for hosted checkout and refunds.",
		detail: "Customer-owned accounts",
	},
	{
		icon: Webhook,
		title: "Inspect every operation",
		text: "Follow normalized states through events, API logs, deliveries, and replayable webhooks.",
		detail: "Seven-day API logs",
	},
];

export function WorkflowSection() {
	return (
		<section id="workflow" className="workflow-section">
			<div className="landing-shell workflow-layout">
				<div className="workflow-intro">
					<Typography as="h2" variant="display">
						Build safely first.
						<br />
						Connect real payments when ready.
					</Typography>
					<Typography className="workflow-reveal-text">
						The same API shape moves from simulated operations to provider-backed checkout, with
						explicit environments and no silent provider failover.
					</Typography>
				</div>
				<div className="workflow-steps">
					{steps.map((step, index) => {
						const Icon = step.icon;

						return (
							<article className="workflow-card" key={step.title}>
								<div className="workflow-index">0{index + 1}</div>
								<div className="workflow-icon">
									<Icon size={23} />
								</div>
								<Typography as="h3" variant="heading">
									{step.title}
								</Typography>
								<Typography>{step.text}</Typography>
								<span>
									<CheckCircle2 size={15} /> {step.detail}
								</span>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
