import { Flex } from "@shaastra/ui";
import { useOutlet } from "react-router-dom";

export default function AuthLayout() {
	const outlet = useOutlet();
	return (
		<Flex className={ "h-screen" }>
			<div className={ "flex-grow auth-bg h-screen" }></div>
			<div className={ "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				{ outlet }
			</div>
		</Flex>
	);
}