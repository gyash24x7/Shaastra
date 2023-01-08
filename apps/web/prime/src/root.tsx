import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { Route, Router, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import AuthLayout from "./layouts/auth.layout.js";
import LoginPage from "./pages/auth/login.js";
import SignUpPage from "./pages/auth/signup.js";
import HomePage from "./pages/index.js";
import "./styles/global.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route path={ "/" }>
					<Route path={ "/" } component={ HomePage }/>
					<Route path={ "/auth" } component={ AuthLayout }>
						<Route path={ "/login" } component={ LoginPage }/>
						<Route path={ "/signup" } component={ SignUpPage }/>
					</Route>
				</Route>
			</Routes>
		</Router>
	);
}

render( () => <App/>, document.getElementById( "root" ) as HTMLElement );