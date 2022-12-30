import { Flex } from "@shaastra/ui";
import { Outlet } from "@solidjs/router";

export default function AuthLayout() {
	return (
		<Flex className = { "h-screen" }>
			<div class = { "flex-grow auth-bg h-screen" }></div>
			<div class = { "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				<Outlet/>
			</div>
		</Flex>
	);
}