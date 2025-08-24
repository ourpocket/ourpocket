import { Link } from "@tanstack/react-router";

export const Logo = () => <img src="/logo.svg" alt="logo" />;
export const LogoText = () => (
	<Link to="/">
		<img src="/logo/our_pocket.png" alt="logo" width={160} />
	</Link>
);
export const SimpleLogo = () => <img src="/logo/simple_logo.png" alt={"logo"} />;
