import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import "./styles/global.css";
import { AuthProvider } from "./utils/auth";
import { queryClient } from "./utils/client";

function App() {
	return (
		<StrictMode>
			<QueryClientProvider client={ queryClient }>
				<AuthProvider>
					<BrowserRouter>
						<AppRoutes/>
					</BrowserRouter>
				</AuthProvider>
			</QueryClientProvider>
		</StrictMode>
	);
}

const rootElement = document.getElementById( "root" )!;
ReactDOM.createRoot( rootElement ).render( <App/> );