import React from "react"
import ReactDOM from "react-dom/client"
import { Auth0Provider } from "@auth0/auth0-react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<React.StrictMode>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Auth0Provider
				domain = { import.meta.env[ "VITE_AUTH0_DOMAIN" ]! }
				clientId = { import.meta.env[ "VITE_AUTH0_CLIENT_ID" ]! }
				redirectUri = { window.location.origin }
				audience = { import.meta.env[ "VITE_AUTH0_AUDIENCE" ] }
				useRefreshTokens
			>
				<RouterProvider router = { router }/>
			</Auth0Provider>
		</MantineProvider>
	</React.StrictMode>
)
