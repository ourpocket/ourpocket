import { Typography } from "@/components/ui/typography";
import { Activity, Braces, RefreshCw, WalletCards } from "lucide-react";

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
						One contract for sandbox payments, refunds, wallets, and transfers.
					</Typography>
					<div className="api-lines">
						<p>
							<span>POST</span> /v1/payments
						</p>
						<p>
							<span>POST</span> /v1/refunds
						</p>
						<p>
							<span>POST</span> /v1/sandbox/transfers
						</p>
					</div>
				</article>
				<article className="infra-card infra-card-routing landing-reveal">
					<div className="card-heading">
						<RefreshCw size={22} />
						<span>Provider control</span>
					</div>
					<Typography as="h3" variant="heading">
						Choose a connected provider for each live operation. Verify uncertain outcomes before acting again.
					</Typography>
					<div className="routing-visual">
						<span>Payment</span>
						<div>
							<i />
							<i />
							<i />
						</div>
						<span>Verify</span>
					</div>
				</article>
				<article className="infra-card infra-card-control landing-reveal">
					<div className="card-heading">
						<WalletCards size={22} />
						<span>Wallet infrastructure</span>
					</div>
					<Typography as="h3" variant="heading">
						Create provider-owned dedicated or virtual accounts with Paystack and Flutterwave.
					</Typography>
					<div className="balance-panel">
						<small>Live provider overview</small>
						<strong>Balances fetched on demand</strong>
						<p>
							<span>Account ownership</span>
							<b>Your provider</b>
						</p>
					</div>
				</article>
				<article className="infra-card infra-card-observe landing-reveal">
					<div className="card-heading">
						<Activity size={22} />
						<span>Observability</span>
					</div>
					<Typography as="h3" variant="heading">
						Inspect API usage and live provider activity without storing provider responses.
					</Typography>
					<div className="api-lines">
						<p>Live provider overview</p>
						<p>Payment verification</p>
						<p>API request logs</p>
					</div>
				</article>
			</div>
		</section>
	);
}
