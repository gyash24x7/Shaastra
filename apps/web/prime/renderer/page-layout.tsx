import type { Props } from "./types";
import type { JSXElement } from "solid-js";
import "../styles/global.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/fjalla-one/400.css";

export default function PageLayout( props: Props ): JSXElement {
	const renderedRoute = () => {
		const { Page, pageProps } = props.route() ?? {};
		return Page && <Page { ...pageProps } />;
	};

	return <div>{ renderedRoute() }</div>;
};