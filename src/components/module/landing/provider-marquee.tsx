import { Typography } from "@/components/ui/typography";

const providers = [
	{ name: "Paystack", logo: "/img/paystack_logo.svg" },
	{ name: "Flutterwave", logo: "/img/flutterwave_logo.svg" },
	{ name: "Turnkey", logo: "/img/turnkey_logo.svg" },
	{ name: "Privy", logo: "/img/privy_logo.svg" },
	{ name: "Fincra", logo: "/img/fincra_logo.svg" },
	{ name: "Monnify", logo: "/img/monnify_logo.svg" },
	{ name: "Paga", logo: "/img/paga_wordmark.svg" },
	{ name: "Stripe", logo: "/img/stripe_logo.svg" },
];

export function ProviderMarquee() {
	return (
		<section className="provider-strip" aria-label="Financial infrastructure providers">
			<Typography>
				Live today: Paystack, Flutterwave, Turnkey, and Privy. More rails are already in view.
			</Typography>
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
