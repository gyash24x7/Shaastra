import ReactDOM from "react-dom/client";

import "normalize.css/normalize.css";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "./global.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { defaultTheme, Provider } from "@adobe/react-spectrum";

ReactDOM.createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<Provider theme = { defaultTheme }>
		<RouterProvider router = { router } />
	</Provider>
);