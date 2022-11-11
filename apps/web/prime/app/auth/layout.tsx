import type { ReactNode } from "react";

export interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout( props: AuthLayoutProps ) {
	return (
		<div className = { "flex w-screen h-screen bg-dark-200 text-light" }>
			<div className = { "flex-grow auth-bg" }></div>
			<div className = { "w-1/4 border-l-2 border-dark-500 p-8" } style = { { minWidth: 500 } }>
				{ props.children }
			</div>
		</div>
	);
}