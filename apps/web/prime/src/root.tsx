import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { ClientProvider } from "@shaastra/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/provider.js";
import { AppRoutes } from "./routes/index.js";
import "./styles/global.css";

function App() {
	return (
		<StrictMode>
			<ClientProvider>
				<AuthProvider refresh={ async () => {} }>
					<BrowserRouter>
						<AppRoutes/>
					</BrowserRouter>
				</AuthProvider>
			</ClientProvider>
		</StrictMode>
	);
}

const rootElement = document.getElementById( "root" )!;
ReactDOM.createRoot( rootElement ).render( <App/> );