import { LogoText } from "@/components/micro/logo.tsx";

const Header = () => {
	return (
		<div className={"container mx-auto justify-between flex gap-2 items-center"}>
			<div className="flex items-center gap-2">
				<LogoText />
			</div>

			<div />
		</div>
	);
};
export default Header;
