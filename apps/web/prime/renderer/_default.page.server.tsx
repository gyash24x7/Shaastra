import { generateHydrationScript, renderToStream } from "solid-js/web";
import { dangerouslySkipEscape, escapeInject, stampPipe } from "vite-plugin-ssr";
import PageLayout from "./page-layout";
import type { PageContext } from "./types";

export const passToClient = [ "pageProps", "documentProps" ];

export function render( pageContext: PageContext ) {
	const { Page, pageProps } = pageContext;

	const { pipe } = renderToStream( () => (
		<PageLayout
			route = { () => (
				{ Page, pageProps }
			) }
		/>
	) );
	stampPipe( pipe, "node-stream" );

	// See https://vite-plugin-ssr.com/head
	const { documentProps } = pageContext;
	const title = documentProps?.title || "Vite SSR app";
	const description = documentProps?.description || "App using Vite + vite-plugin-ssr";

	return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${ description }" />
        <title>${ title }</title>
        ${ dangerouslySkipEscape( generateHydrationScript() ) }
      </head>
      <body>
        <div id="page-view">${ pipe }</div>
      </body>
    </html>`;
}