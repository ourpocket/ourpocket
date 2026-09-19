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
						Test payments safely. Go live with one API.
					</Typography>
					<Typography className="hero-description">
						Simulate payments, refunds, wallets, balances, and transfers in Sandbox. Connect
						Paystack or Flutterwave when your project is ready for production checkout.
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
						<strong>Open source</strong> payment infrastructure for developers building in Africa.
					</Typography>
				</div>

				<CodePane />
			</div>
		</section>
	);
}
