const providers = ["PAYSTACK", "FLUTTERWAVE", "FINCRA", "MONNIFY", "PAGA", "STRIPE"];

export function ProviderMarquee() {
	return (
		<section className="provider-strip" aria-label="Supported wallet providers">
			<p>Connect the providers your product already depends on.</p>
			<div className="provider-list">
				{providers.map((provider) => (
					<span key={provider}>{provider}</span>
				))}
			</div>
		</section>
	);
}
