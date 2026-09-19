import { Typography } from "@/components/ui/typography";
import { Activity, ArrowUpRight, Braces, RefreshCw, ShieldCheck, WalletCards } from "lucide-react";

export function InfrastructureGrid() {
	return (
		<section id="infrastructure" className="landing-section landing-shell">
			<div className="section-heading landing-reveal">
				<Typography as="h2" variant="display">
					Financial operations,
					<br />
					from Sandbox to production.
				</Typography>
				<Typography>
					Build with deterministic simulators, connect customer-owned providers, and operate the
					same normalized model from first request to reconciliation.
				</Typography>
			</div>
			<div className="infrastructure-grid">
				<article className="infra-card infra-card-api landing-reveal">
					<div className="card-heading">
						<Braces size={22} />
						<span>Unified API</span>
					</div>
					<Typography as="h3" variant="heading">
						One contract across payments, refunds, wallets, and events.
					</Typography>
					<div className="api-lines">
						<p>
							<span>POST</span> /payments
						</p>
						<p>
							<span>POST</span> /refunds
						</p>
						<p>
							<span>GET</span> /events
						</p>
					</div>
				</article>
				<article className="infra-card infra-card-routing landing-reveal">
					<div className="card-heading">
						<RefreshCw size={22} />
						<span>Smart routing</span>
					</div>
					<Typography as="h3" variant="heading">
						Route by health, success rate, fees, latency, or your own priority.
					</Typography>
					<div className="routing-visual">
						<span>Payment</span>
						<div>
							<i />
							<i />
							<i />
						</div>
						<span>Verified</span>
					</div>
				</article>
				<article className="infra-card infra-card-control landing-reveal">
					<div className="card-heading">
						<WalletCards size={22} />
						<span>Wallet infrastructure</span>
					</div>
					<Typography as="h3" variant="heading">
						Simulate fiat balances, then create production wallets with Turnkey or Privy.
					</Typography>
					<div className="balance-panel">
						<small>Available balance</small>
						<strong>₦2,840,000.00</strong>
						<p>
							<span>Money in</span>
							<b>+ ₦184,320</b>
						</p>
					</div>
				</article>
				<article className="infra-card infra-card-observe landing-reveal">
					<div className="card-heading">
						<Activity size={22} />
						<span>Observability</span>
					</div>
					<Typography as="h3" variant="heading">
						Trace requests, routing decisions, unknown outcomes, and webhook deliveries.
					</Typography>
					<div className="activity-chart">
						<i />
						<i />
						<i />
						<i />
						<i />
						<i />
						<i />
						<i />
						<i />
					</div>
					<div className="card-footer">
						<span>
							<ShieldCheck size={14} /> Healthy
						</span>
						<a href="#workflow">
							See workflow <ArrowUpRight size={14} />
						</a>
					</div>
				</article>
			</div>
		</section>
	);
}
