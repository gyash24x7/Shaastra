import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { ClientProvider } from "@shaastra/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import AuthLayout from "./layouts/auth.layout.js";
import LoginPage from "./pages/auth/login.js";
import SignUpPage from "./pages/auth/signup.js";
import HomePage from "./pages/index.js";
import CreateMemberPage from "./pages/members/create.js";
import "./styles/global.css";

function App() {
	return (
		<StrictMode>
			<ClientProvider>
				<BrowserRouter>
					<Routes>
						<Route path={ "/" } element={ <HomePage/> }/>
						<Route path={ "/auth" } element={ <AuthLayout/> }>
							<Route path={ "login" } element={ <LoginPage/> }/>
							<Route path={ "signup" } element={ <SignUpPage/> }/>
						</Route>
						<Route path={ "/members/create" } element={ <CreateMemberPage/> }/>
					</Routes>
				</BrowserRouter>
			</ClientProvider>
		</StrictMode>
	);
}

const rootElement = document.getElementById( "root" )!;
ReactDOM.createRoot( rootElement ).render( <App/> );