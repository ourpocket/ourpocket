import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import ModularModals from "@/components/module/popovers/modular-modals";
import { Button } from "@/components/ui/button.tsx";
import { ProviderType } from "@/services/types";
import { Add } from "iconsax-reactjs";

const walletProviders = [
	{
		type: ProviderType.PAYSTACK,
		name: "Paystack",
		description:
			"A leading payment gateway enabling businesses to accept payments via card, bank transfers, and mobile wallets.",
		logo: "/img/paystack_logo.svg",
		secretName: "PAYSTACK_SECRET_KEY",
	},
	{
		type: ProviderType.FLUTTERWAVE,
		name: "Flutterwave",
		description:
			"Pan-African payment infrastructure provider for processing payments across Africa.",
		logo: "/img/flutterwave_logo.svg",
		secretName: "FLW_SECRET_KEY",
	},
] as const;

type WalletProviderMeta = (typeof walletProviders)[number];

function IntegrationGuide({ provider }: { provider: WalletProviderMeta }) {
	const sdkExample = `const wallet = new WalletSDK({
  provider: "${provider.type}",
  apiKey: process.env.${provider.secretName},
});

const userWallet = await wallet.createWallet(userId);

await wallet.fundWallet({
  userId,
  amount: 5000,
  currency: "NGN",
});`;

	const apiExample = `POST /wallets/create
Authorization: Bearer op_live_sk_xxxxx

{
  "provider": "${provider.type}",
  "apiKey": "${provider.secretName}",
  "userId": "user_123",
  "currency": "NGN"
}`;

	return (
		<div className="space-y-5">
			<div>
				<h4 className="text-lg font-semibold text-white">{provider.name}</h4>
				<small className="text-white/70">Supported wallet rail</small>
			</div>
			<div className="space-y-3 rounded-lg border border-white/10 p-4">
				<h5 className="text-sm font-semibold text-white">SDK Request</h5>
				<pre className="max-h-[260px] overflow-auto rounded-md bg-black/30 p-4 text-xs text-gray-200">
					{sdkExample}
				</pre>
			</div>
			<div className="space-y-3 rounded-lg border border-white/10 p-4">
				<h5 className="text-sm font-semibold text-white">Unified API Request</h5>
				<pre className="max-h-[260px] overflow-auto rounded-md bg-black/30 p-4 text-xs text-gray-200">
					{apiExample}
				</pre>
			</div>
		</div>
	);
}

const WalletProvidersPage = () => {
	return (
		<DashboardLayout title="Wallet Providers" description="Manage your wallet providers">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{walletProviders.map((provider) => (
					<ModularCard key={provider.name} content={true}>
						<div className="flex items-center justify-between">
							<div className="flex-col items-center gap-3">
								<img src={provider.logo} alt={provider.name} width={30} />
								<h3 className="mt-2">{provider.name}</h3>
							</div>

							<span className="text-xs text-green-600">supported</span>
						</div>
						<div className="mt-2 text-sm text-gray-400">{provider.description}</div>

						<ModularModals
							trigger={
								<Button className="mt-4 bg-gray-700/20 hover:bg-gray-700/30">
									<Add variant="Bulk" size={20} />
									View Integration
								</Button>
							}
						>
							<IntegrationGuide provider={provider} />
						</ModularModals>
					</ModularCard>
				))}
			</div>
		</DashboardLayout>
	);
};

export default WalletProvidersPage;
