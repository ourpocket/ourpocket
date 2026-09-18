import { Activity, ArrowUpRight, Braces, RefreshCw, ShieldCheck, WalletCards } from "lucide-react";

export function InfrastructureGrid() {
	return (
		<section id="infrastructure" className="landing-section landing-shell">
			<div className="section-heading landing-reveal">
				<h2>
					Infrastructure,
					<br />
					not another wrapper.
				</h2>
				<p>
					Replace provider-specific wallet logic with one operational layer that stays consistent as
					your product grows.
				</p>
			</div>
			<div className="infrastructure-grid">
				<article className="infra-card infra-card-api landing-reveal">
					<div className="card-heading">
						<Braces size={22} />
						<span>Unified API</span>
					</div>
					<h3>A stable contract across every provider.</h3>
					<div className="api-lines">
						<p>
							<span>POST</span> /wallets
						</p>
						<p>
							<span>POST</span> /transfers
						</p>
						<p>
							<span>GET</span> /transactions/:id
						</p>
					</div>
				</article>
				<article className="infra-card infra-card-routing landing-reveal">
					<div className="card-heading">
						<RefreshCw size={22} />
						<span>Smart routing</span>
					</div>
					<h3>Switch providers without rewriting your product.</h3>
					<div className="routing-visual">
						<span>Request</span>
						<div>
							<i />
							<i />
							<i />
						</div>
						<span>Delivered</span>
					</div>
				</article>
				<article className="infra-card infra-card-control landing-reveal">
					<div className="card-heading">
						<WalletCards size={22} />
						<span>Wallet control</span>
					</div>
					<h3>Create, fund, debit, and reconcile from one place.</h3>
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
					<h3>Know what happened before your customer asks.</h3>
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
