import "./styles/global.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/fjalla-one/400.css";
import { lazy, Show, Suspense } from "solid-js";
import { render } from "solid-js/web";
import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { Spinner } from "@shaastra/ui";
import { ClientProvider, createMeQuery } from "@shaastra/client";

const AuthLayout = lazy( () => import("./pages/auth/layout") );
const LoginPage = lazy( () => import("./pages/auth/login") );
const SignUpPage = lazy( () => import("./pages/auth/signup") );
const HomePage = lazy( () => import("./pages/index") );

function PublicRoutes() {
	return (
		<>
			<Route path = { "/" } component = { () => <Navigate href = { "/auth/login" } /> } />
			<Route path = { "/auth" } component = { AuthLayout }>
				<Route path = { "/login" } component = { LoginPage } />
				<Route path = { "/signup" } component = { SignUpPage } />
			</Route>
			<Route path = { "*" } component = { () => <Navigate href = { "/auth/login" } /> } />
		</>
	);
}

function PrivateRoutes() {
	return (
		<>
			<Route path = { "/" } component = { HomePage } />
			<Route path = { "/auth" } component = { () => <Navigate href = { "/" } /> } />
		</>
	);
}

function App() {
	const { data, Provider } = createMeQuery( { provider: true } );
	return (
		<Router>
			<Routes>
				<Route path = { "/" }>
					<Suspense fallback = { <Spinner /> }>
						<Provider>
							<Show when = { !!data() } keyed fallback = { <PublicRoutes /> }>
								<PrivateRoutes />
							</Show>
						</Provider>
					</Suspense>
				</Route>
			</Routes>
		</Router>
	);
}

render( () => <ClientProvider><App /></ClientProvider>, document.getElementById( "root" ) as HTMLElement );