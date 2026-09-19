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
				{title && (
					<h2 className="mb-1 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
						{title}
					</h2>
				)}
				{description && <p className="max-w-2xl text-sm leading-6 text-white/45">{description}</p>}
			</div>
			{actionTab && <div className="shrink-0">{actionTab}</div>}
		</div>
	);
};

export default PageInfo;
