import type { ReactNode } from "react";
import { Flex } from "@shaastra/ui/flex";

export interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout( props: AuthLayoutProps ) {
	return (
		<Flex className = { "bg-dark-100 text-light h-screen" }>
			<div className = { "flex-grow auth-bg h-screen" }></div>
			<div className = { "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				{ props.children }
			</div>
		</Flex>
	);
}