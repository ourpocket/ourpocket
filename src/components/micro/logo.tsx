import { Link } from "@tanstack/react-router";

export const Logo = () => <img src="/logo.svg" alt="logo" />;
export const LogoText = ({
	size = 160,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Link to="/">
		<img src="/logo/our_pocket.png" alt="logo" width={size} className={className} />
	</Link>
);
export const SimpleLogo = () => <img src="/logo/simple_logo.png" alt={"logo"} />;
