import { ReactNode } from "react";

export default function AppLayout( props: { children: ReactNode } ) {
	return (
		<html>
		<head></head>
		<body>
		<main>{ props.children }</main>
		</body>
		</html>
	);
}