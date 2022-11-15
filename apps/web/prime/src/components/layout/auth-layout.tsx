import { Flex } from "@shaastra/ui";
import type { JSXElement } from "solid-js";

export interface AuthLayoutProps {
	children: JSXElement;
}

export default function AuthLayout( props: AuthLayoutProps ) {
	return (
		<Flex className = { "bg-dark-100 text-light h-screen" }>
			<div class = { "flex-grow auth-bg h-screen" }></div>
			<div class = { "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				{ props.children }
			</div>
		</Flex>
	);
}