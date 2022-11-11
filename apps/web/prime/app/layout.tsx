import type { ReactNode } from "react";
import "./global.css";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";

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