import type { AppProps } from "next/app";
import Head from "next/head";
import "./styles.css";
import { MantineProvider } from "@mantine/core";
import { Fragment } from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export default ( { Component, pageProps: { session, ...pageProps } }: AppProps ) => (
	<Fragment>
		<Head>
			<title>Shaastra Prime</title>
			<meta name = "viewport" content = "minimum-scale=1, initial-scale=1, width=device-width"/>
		</Head>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Auth0Provider
				domain = { process.env[ "NEXT_PUBLIC_AUTH0_DOMAIN" ]! }
				clientId = { process.env[ "NEXT_PUBLIC_AUTH0_CLIENT_ID" ]! }
				redirectUri = { process.env[ "NEXT_PUBLIC_AUTH0_BASE_URL" ] }
				audience = { process.env[ "NEXT_PUBLIC_AUTH0_AUDIENCE" ] }
			>
				<Component { ...pageProps } />
			</Auth0Provider>
		</MantineProvider>
	</Fragment>
);
