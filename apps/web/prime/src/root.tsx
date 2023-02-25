import { ClientProvider, queryClient } from "@app/client";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import "./styles/global.css";

function App() {
	return (
		<StrictMode>
			<ClientProvider client={ queryClient }>
				<BrowserRouter>
					<AppRoutes/>
				</BrowserRouter>
			</ClientProvider>
		</StrictMode>
	);
}

const rootElement = document.getElementById( "root" )!;
ReactDOM.createRoot( rootElement ).render( <App/> );