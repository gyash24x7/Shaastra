import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { createRouteConfig, createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import AuthLayout from "./layouts/auth.layout.js";
import LoginPage from "./pages/auth/login.js";
import SignUpPage from "./pages/auth/signup.js";
import HomePage from "./pages/index.js";
import "./styles/global.css";

const rootRoute = createRouteConfig();

const homeRoute = rootRoute.createRoute( {
	path: "/",
	component: HomePage
} );

const authRoute = rootRoute.createRoute( {
	path: "/auth",
	component: AuthLayout
} );

const loginRoute = authRoute.createRoute( {
	path: "/login",
	component: LoginPage
} );

const signUpRoute = authRoute.createRoute( {
	path: "/signup",
	component: SignUpPage
} );

const routeConfig = rootRoute.addChildren( [
	homeRoute,
	authRoute.addChildren( [ loginRoute, signUpRoute ] )
] );

const router = createRouter( { routeConfig } );

function App() {
	return <RouterProvider router={ router }/>;
}

const rootElement = document.getElementById( "root" )!;
if ( !rootElement.innerHTML ) {
	const root = ReactDOM.createRoot( rootElement );
	root.render(
		<StrictMode>
			<App/>
		</StrictMode>
	);
}