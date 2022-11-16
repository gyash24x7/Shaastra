import type { Accessor, Component, JSXElement } from "solid-js";
import type { PageContextBuiltIn } from "vite-plugin-ssr";

export interface Props {
	route: Accessor<Route | null>;
}

export interface Children {
	children: JSXElement;
}

export interface Route {
	Page: Component;
	pageProps: Record<string, unknown>;
}

export type PageProps = {}
export type PageContext = PageContextBuiltIn & {
	Page: ( pageProps: PageProps ) => Component
	pageProps: PageProps
	documentProps?: {
		title?: string
		description?: string
	}
}