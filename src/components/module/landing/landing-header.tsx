import { LogoText } from "@/components/micro/logo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Github, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = ["Product", "Solutions", "Developers", "Resources", "Company", "Pricing"];

export function LandingHeader() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			<a
				className="landing-announcement"
				href="https://github.com/ourpocket/ourpocket"
				target="_blank"
				rel="noreferrer"
			>
				<span className="announcement-badge">OPEN</span>
				<span>The financial control plane for payments, wallets, and provider operations.</span>
				<strong>
					View the repository <ArrowRight size={14} />
				</strong>
			</a>
			<header className="landing-header">
				<div className="landing-nav">
					<LogoText size={148} className="landing-logo" />
					<nav
						aria-label="Main navigation"
						className={`landing-nav-links${menuOpen ? " is-open" : ""}`}
					>
						{navItems.map((item) =>
							item === "Pricing" ? (
								<Link key={item} to="/pricing" onClick={() => setMenuOpen(false)}>
									{item}
									<ChevronDown size={13} />
								</Link>
							) : (
								<a
									key={item}
									href={
										item === "Developers"
											? "/#developers"
											: item === "Product"
												? "/#infrastructure"
												: "/#workflow"
									}
									onClick={() => setMenuOpen(false)}
								>
									{item}
									<ChevronDown size={13} />
								</a>
							),
						)}
					</nav>
					<div className="landing-nav-actions">
						<a
							className="landing-icon-link"
							href="https://github.com/ourpocket/ourpocket"
							target="_blank"
							rel="noreferrer"
							aria-label="View OurPocket on GitHub"
						>
							<Github size={18} />
						</a>
						<Link className="landing-sign-in" to="/auth/login">
							Sign in
						</Link>
						<Link
							className="landing-button landing-button-primary landing-button-small"
							to="/auth/register"
						>
							Get started <ArrowRight size={15} />
						</Link>
						<button
							type="button"
							className="landing-menu"
							onClick={() => setMenuOpen((open) => !open)}
							aria-expanded={menuOpen}
							aria-label={menuOpen ? "Close navigation" : "Open navigation"}
						>
							{menuOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>
			</header>
		</>
	);
}
