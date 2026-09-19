import { LogoText } from "@/components/micro/logo";
import { Typography } from "@/components/ui/typography";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";

export function DeveloperCta() {
	return (
		<>
			<section id="developers" className="developer-cta landing-shell landing-reveal">
				<div className="cta-orbit cta-orbit-one" />
				<div className="cta-orbit cta-orbit-two" />
				<Typography>Move from a safe sandbox to controlled production infrastructure.</Typography>
				<Typography as="h2" variant="display">
					Build the financial stack
					<br />
					your product can operate.
				</Typography>
				<div className="hero-actions">
					<Link className="landing-button landing-button-light" to="/auth/register">
						Start building free <ArrowRight size={17} />
					</Link>
					<a
						className="landing-button landing-button-ghost"
						href="https://github.com/ourpocket/ourpocket"
						target="_blank"
						rel="noreferrer"
					>
						<Github size={16} /> View GitHub
					</a>
				</div>
			</section>
			<footer className="landing-footer landing-shell">
				<div>
					<LogoText size={142} className="landing-logo" />
					<Typography>Payments, wallets, routing, and reconciliation through one API.</Typography>
				</div>
				<nav aria-label="Footer navigation">
					<a href="/#infrastructure">Infrastructure</a>
					<a href="/#workflow">How it works</a>
					<a href="https://github.com/ourpocket/ourpocket">Documentation</a>
					<Link to="/pricing">Pricing</Link>
					<Link to="/auth/login">Sign in</Link>
				</nav>
				<div className="footer-bottom">
					<span>© {new Date().getFullYear()} OurPocket</span>
					<span className="system-status">
						<i /> All systems operational
					</span>
				</div>
			</footer>
		</>
	);
}
