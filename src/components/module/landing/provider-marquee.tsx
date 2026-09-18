const providers = [
	{ name: "Paystack", logo: "/img/paystack_logo.svg" },
	{ name: "Flutterwave", logo: "/img/flutterwave_logo.svg" },
	{ name: "Fincra", logo: "/img/fincra_logo.svg" },
	{ name: "Monnify", logo: "/img/monnify_logo.svg" },
	{ name: "Paga", logo: "/img/paga_wordmark.svg" },
	{ name: "Stripe", logo: "/img/stripe_logo.svg" },
];

export function ProviderMarquee() {
	return (
		<section className="provider-strip" aria-label="Supported wallet providers">
			<p>Connect the providers your product already depends on.</p>
			<div className="provider-list">
				{providers.map((provider) => (
					<span key={provider.name} className="provider-logo">
						<img src={provider.logo} alt={provider.name} loading="lazy" />
					</span>
				))}
			</div>
		</section>
	);
}
