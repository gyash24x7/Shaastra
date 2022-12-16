import "./index.css";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { createComponent, insert, template } from "solid-js/web";
import { createRoot } from "solid-js";
import { themes } from "@storybook/theming";

export const decorators = [
	Story => createRoot( () => {
		const element = template( "<div/>" ).cloneNode( true );
		insert( element, createComponent( Story, {} ) );
		return element;
	} )
];


export const parameters = {
	docs: { theme: themes.dark },
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	}
};
