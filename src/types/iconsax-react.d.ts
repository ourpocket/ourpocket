declare module "iconsax-react" {
	import type { FC } from "react";

	interface IconProps {
		size?: number;
		className?: string;
		color?: string;
	}

	export const Category: FC<IconProps>;
	export const Wallet3: FC<IconProps>;
	export const ArrowRight2: FC<IconProps>;
	export const Profile2User: FC<IconProps>;
	export const SecuritySafe: FC<IconProps>;
	export const Chart: FC<IconProps>;
	export const Setting2: FC<IconProps>;
	export const MessageQuestion: FC<IconProps>;
	export const Activity: FC<IconProps>;
	export const Profile: FC<IconProps>;
	export const HambergerMenu: FC<IconProps>;
	export const ArrowDown2: FC<IconProps>;
}
