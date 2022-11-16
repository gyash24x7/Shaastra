import { createSignal } from "solid-js";
import { hydrate } from "solid-js/web";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client/router";
import PageLayout from "./page-layout";
import type { PageContext, Route } from "./types";

let layoutReady = false;
export const clientRouting = true;

const [ route, setRoute ] = createSignal<Route | null>( null );

export function render( pageContext: PageContextBuiltInClient & PageContext ) {
	const content = document.getElementById( "page-view" );
	const { Page, pageProps } = pageContext;

	// Set the new route.
	setRoute( { Page, pageProps } );

	// If haven't rendered the layout yet, do so now.
	if ( !layoutReady ) {
		// Render the page.
		// This is the first page rendering; the page has been rendered to HTML
		// And we now make it interactive.
		hydrate( () => <PageLayout route = { () => route() } />, content! );
		layoutReady = true;
	}
}