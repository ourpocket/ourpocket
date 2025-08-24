import CodePreciewBlock from "@/components/layouts/mac-like-codeblock.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { ENVIRONMENT_MODE } from "../../../../constant";
const Hero = () => {
	const SHOWDOWNLOAD = (
		<div className={"flex items-center justify-center gap-2"}>
			<button
				className=" bg-[var(--default)] dark:bg-white text-white
      dark:text-black text-sm font-semibold px-5 py-2 rounded-lg
      flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
				data-tally-open="wAg0py"
				data-tally-emoji-text="👋"
				data-tally-emoji-animation="wave"
			>
				<span>Get Started</span>
			</button>

			{ENVIRONMENT_MODE.DEV && (
				<Link to={"/auth/login"}>
					<Button>Authenticte</Button>
				</Link>
			)}
		</div>
	);

	return (
		<section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-4 text-center dark:bg-black">
			<h3
				className="text-2xl md:text-3xl pt-12 sm:text-2xl font-bold leading-snug max-w-3xl mb-6
       "
			>
				"Why Are We Still <span className="bg-[var(--default)] py-2 px-2">Rebuilding</span>{" "}
				<br className="hidden sm:block" />
				the Same Wallet Integration?"
			</h3>

			<p
				className="text-gray-400  dark:text-gray-300
        text-[14.6px] max-w-2xl px-3 mb-6"
			>
				Every fintech, marketplace, or SaaS team copies the same wallet logic again and again.
				<span className="text-[var(--default)]  px-1 font-medium mx-1">Our Pocket</span>
				unifies wallet providers like Paystack, Flutterwave, and Monnify into one clean API.
				<span className="bg-[#fb8a2e]-500 text-[var(--default)] px-1 font-medium mx-1">
					Integrate once
				</span>
				,
				<span className="bg-[#fb8a2e]-500 text-[var(--default)] px-1 font-medium mx-1">
					switch freely.
				</span>
			</p>

			{SHOWDOWNLOAD}

			<CodePreciewBlock
				code={`

const wallet = new WalletSDK({
provider: 'flutterwave',
apiKey: process.env.FLW_SECRET_KEY,
});

// Create a wallet
const userWallet = await wallet.createWallet(userId);

// 💵 Fund a wallet
await wallet.fundWallet({
userId,
amount: 5000,
currency: 'NGN',
});


`}
			/>
		</section>
	);
};

export default Hero;
