import { Flex } from "@shaastra/ui";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
	return (
		<Flex className={ "h-screen" }>
			<div className={ "flex-grow auth-bg h-screen" }></div>
			<div className={ "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				<Outlet/>
			</div>
		</Flex>
	);
}