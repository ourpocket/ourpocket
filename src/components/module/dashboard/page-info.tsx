import * as React from "react";
interface IPageProps {
	title?: string;
	description?: string;
	actionTab?: React.ReactNode;
}

const PageInfo = ({ title, actionTab, description }: IPageProps) => {
	return (
		<div className={"flex items-center justify-between mb-4"}>
			<div>
				<h4 className={"font-semibold"}>{title}</h4>
				<small className={"text-gray-500"}>{description}</small>
			</div>
			<div>{actionTab}</div>
		</div>
	);
};
export default PageInfo;
