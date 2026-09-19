import { CodePane } from "@/components/module/landing/code-pane";
import { Typography } from "@/components/ui/typography";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
	return (
		<section className="hero-frame">
			<div className="landing-hero landing-shell">
				<div className="hero-copy">
					<Typography as="h1" variant="display" className="hero-title">
						Integrate once. Run every financial provider.
					</Typography>
					<Typography className="hero-description">
						Connect payments and wallets through one control plane. Route transactions, monitor
						providers, and reconcile every operation without rebuilding your stack.
					</Typography>
					<div className="hero-actions">
						<Link className="landing-button landing-button-primary" to="/auth/register">
							Get started <ArrowRight size={17} />
						</Link>
						<a
							className="landing-button landing-button-secondary"
							href="https://github.com/ourpocket/ourpocket"
							target="_blank"
							rel="noreferrer"
						>
							Explore docs
						</a>
					</div>
					<Typography className="hero-proof-line">
						<strong>One API.</strong> Sandbox simulators, production providers, and every decision
						in view.
					</Typography>
				</div>

				<CodePane />
			</div>
		</section>
	);
}
