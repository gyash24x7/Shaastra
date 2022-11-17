import "./styles/global.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/fjalla-one/400.css";
import { render } from "solid-js/web";
import { Route, Router, Routes } from "@solidjs/router";
import HomePage from "./pages/index";
import AuthLayout from "./pages/auth/layout";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";

function App() {
	return (
		<Router>
			<Routes>
				<Route path = { "/" }>
					<Route path = { "/" } component = { HomePage } />
					<Route path = { "/auth" } component = { AuthLayout }>
						<Route path = { "/login" } component = { LoginPage } />
						<Route path = { "/signup" } component = { SignUpPage } />
					</Route>
				</Route>
			</Routes>
		</Router>
	);
}

render( () => <App />, document.getElementById( "root" ) as HTMLElement );