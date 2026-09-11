import { CheckCircle2, Code2, Route, Webhook } from "lucide-react";

const steps = [
	{
		icon: Code2,
		title: "Integrate once",
		text: "Use a single SDK and a consistent wallet contract across your stack.",
		detail: "One API key",
	},
	{
		icon: Route,
		title: "Choose your provider",
		text: "Route each wallet to the provider that fits your market and use case.",
		detail: "No code rewrite",
	},
	{
		icon: Webhook,
		title: "Operate with confidence",
		text: "Normalized webhooks and transaction states keep your ledger in sync.",
		detail: "Predictable events",
	},
];

export function WorkflowSection() {
	return (
		<section id="workflow" className="workflow-section">
			<div className="landing-shell workflow-layout">
				<div className="workflow-intro">
					<h2>
						We handle the pipes.
						<br />
						You ship the product.
					</h2>
					<p className="workflow-reveal-text">
						Provider quirks, inconsistent payloads, and brittle reconciliation should not dictate
						your roadmap. OurPocket turns the complexity underneath into a clean interface your team
						can trust.
					</p>
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
								<h3>{step.title}</h3>
								<p>{step.text}</p>
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
