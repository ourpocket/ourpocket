const providers = [
	{ name: "Paystack", logo: "/img/paystack_logo.svg", label: true },
	{ name: "Flutterwave", logo: "/img/flutterwave_logo.svg", label: false },
	{ name: "Fincra", logo: "/img/fincra_logo.svg", label: false },
	{ name: "Monnify", logo: "/img/monnify_logo.svg", label: false },
	{ name: "Paga", logo: "/img/paga_wordmark.svg", label: false },
	{ name: "Stripe", logo: "/img/stripe_logo.svg", label: false },
];

export function ProviderMarquee() {
	return (
		<section className="provider-strip" aria-label="Supported wallet providers">
			<p>Connect the providers your product already depends on.</p>
			<div className="provider-list">
				{providers.map((provider) => (
					<span key={provider.name} className="provider-logo">
						<img src={provider.logo} alt={provider.label ? "" : provider.name} loading="lazy" />
						{provider.label && <b>{provider.name}</b>}
					</span>
				))}
			</div>
		</section>
	);
}
