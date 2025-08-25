import { LogoText } from "@/components/micro/logo.tsx";

const Header = () => {
	return (
		<div className={"container mx-auto justify-between flex gap-2 items-center"}>
			<div className="flex items-center gap-2">
				<LogoText />
			</div>

			<div>
				<a href="https://github.com/ourpocket/ourpocket" target="_blank" rel="noopener noreferrer">
					<img
						alt="GitHub Stars"
						width={80}
						src="https://img.shields.io/github/stars/ourpocket/ourpocket?style=social"
					/>
				</a>
			</div>
		</div>
	);
};
export default Header;
