import { LogoText } from "../micro/logo";

interface IAuthLayout {
	children: React.ReactNode;
	title?: string;
	description?: string;
	isCentered?: boolean;
	icon?: string | React.ReactNode;
}

const AuthLayout = ({ children, title, description, isCentered = false, icon }: IAuthLayout) => {
	return (
		<div>
			<div
				className="flex justify-between
			 items-center w-full  mx-auto  px-[10em] py-2"
			>
				<LogoText />
				{/* <button className="inline-flex items-center justify-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
					My Account
				</button> */}
			</div>
			<div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 bg-[#171717]">
				<div className="w-full max-w-[400px] space-y-8 border p-10 px-10 rounded-xl ">
					<div className="flex items-center justify-center">
						{icon && typeof icon === "string" ? (
							<img width={100} alt="logo" src={icon} />
						) : icon ? (
							<>{icon}</>
						) : null}
					</div>
					<div className={`flex flex-col space-y-2 ${isCentered ? "text-center" : ""}`}>
						<h4 className="text-2xl font-semibold tracking-tight">{title}</h4>
						{description && <p className="text-gray-500">{description}</p>}
					</div>

					<div className="space-y-6">{children}</div>
				</div>
			</div>
		</div>
	);
};
export default AuthLayout;
