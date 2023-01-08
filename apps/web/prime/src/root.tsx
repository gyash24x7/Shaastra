import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/auth.layout.js";
import LoginPage from "./pages/auth/login.js";
import SignUpPage from "./pages/auth/signup.js";
import HomePage from "./pages/index.js";
import "./styles/global.css";

const router = createBrowserRouter( [
	{ path: "/", element: <HomePage/> },
	{
		path: "/auth",
		element: <AuthLayout/>,
		children: [
			{ path: "login", element: <LoginPage/> },
			{ path: "signup", element: <SignUpPage/> }
		]
	}

] );

function App() {
	return (
		<StrictMode>
			<RouterProvider router={ router }/>
		</StrictMode>
	);
}

const rootElement = document.getElementById( "root" )!;
ReactDOM.createRoot( rootElement ).render( <App/> );