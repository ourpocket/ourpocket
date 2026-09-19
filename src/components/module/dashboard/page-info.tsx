import { Typography } from "@/components/ui/typography";
import * as React from "react";

interface IPageProps {
	title?: string;
	description?: string;
	actionTab?: React.ReactNode;
}

const PageInfo = ({ title, actionTab, description }: IPageProps) => {
	return (
		<div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="min-w-0">
				{title && <Typography variant="title">{title}</Typography>}
				{description && (
					<Typography className="mt-1 max-w-2xl text-white/45">{description}</Typography>
				)}
			</div>
			{actionTab && <div className="shrink-0">{actionTab}</div>}
		</div>
	);
};

export default PageInfo;
