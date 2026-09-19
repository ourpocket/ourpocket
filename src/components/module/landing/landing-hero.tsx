import { CodePane } from "@/components/module/landing/code-pane";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
	return (
		<section className="hero-frame">
			<div className="landing-hero landing-shell">
				<div className="hero-copy">
					<h1 className="hero-title">One API. Every wallet.</h1>
					<p className="hero-description">
						Create wallets, move money, and switch providers from a single integration. OurPocket
						handles provider differences so your team can keep shipping.
					</p>
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
					{/* <div className="install-command">
						<div className="sdk-list">
							<span>TS</span>
							<span>PY</span>
							<span>GO</span>
						</div>
						<code>$ npm install @ourpocket/sdk</code>
						<button type="button" aria-label="Copy installation command">
							<Copy size={16} />
						</button>
					</div> */}
					<p className="hero-proof-line">
						<strong>Open source</strong> wallet infrastructure for fintech engineers and product
						teams.
					</p>
				</div>

				<CodePane />
			</div>
		</section>
	);
}
