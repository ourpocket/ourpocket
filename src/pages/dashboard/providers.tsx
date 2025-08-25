import DashboardLayout from "@/components/layouts/dashboard-layout.tsx";
import { ModularCard } from "@/components/module/card";
import { Button } from "@/components/ui/button.tsx";
import { Add } from "iconsax-reactjs";

const walletProviders = [
	{
		name: "Paystack",
		description:
			"A leading payment gateway enabling businesses to accept payments via card, bank transfers, and mobile wallets. Acquired by Stripe.",
		logo: "/img/paystack_logo.svg",
		status: "active",
	},
	{
		name: "Flutterwave",
		description:
			"Pan-African payment infrastructure provider that enables global merchants and payment service providers to process payments across Africa.",
		logo: "/img/flutterwave_logo.svg",
		status: "active",
	},
	{
		name: "Paga",
		description:
			"Business banking and payments platform offering tools for payments, loans, and business management.",
		logo: "/img/paga_logo.svg",
		status: "active",
	},

	{
		name: "Fingra",
		description:
			"Business banking and payments platform offering tools for payments, loans, and business management.",
		logo: "/img/paga_logo.svg",
		status: "active",
	},
];

const WalletProvidersPage = () => {
	return (
		<DashboardLayout title="Wallet Providers" description="Manage your wallet providers">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{walletProviders.map((provider) => (
					<ModularCard key={provider.name} content={true}>
						<div className={"flex items-center justify-between"}>
							<div className="flex-col items-center gap-3">
								<img src={provider.logo} alt={provider.name} width={30} />
								<h3 className={"mt-2"}>{provider.name}</h3>
							</div>

							<span className="text-xs text-green-600">{provider.status}</span>
						</div>
						<div className={"text-sm text-gray-400 mt-2"}>{provider.description}</div>

						<Button className={"mt-4 bg-gray-700/20 hover:bg-gray-700/30"}>
							<Add variant={"Bulk"} size={20} />
							Add Wallet Provider
						</Button>
					</ModularCard>
				))}
			</div>
		</DashboardLayout>
	);
};

export default WalletProvidersPage;
