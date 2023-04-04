import type { ReactNode } from "react";
import { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../auth/provider";
import AuthLayout from "../layouts/auth.layout";
import HomeLayout from "../layouts/home.layout";
import HomePage from "../pages";
import LoginPage from "../pages/auth/login";
import SignUpPage from "../pages/auth/signup";

export function PrivateRoute( props: { children: ReactNode } ) {
	const { isLoggedIn } = useAuth();
	if ( !isLoggedIn ) {
		return <Navigate to={ "/auth/login" }/>;
	}

	return <Fragment>{ props.children }</Fragment>;
}

export function PublicRoute( props: { children: ReactNode } ) {
	const { isLoggedIn } = useAuth();
	if ( isLoggedIn ) {
		return <Navigate to={ "/" }/>;
	}

	return <Fragment>{ props.children }</Fragment>;
}

export function AppRoutes() {
	return (
		<Routes>
			<Route path={ "/" } element={ <HomeLayout/> }>
				<Route path={ "" } element={ <PrivateRoute><HomePage/></PrivateRoute> }/>
				<Route path={ "auth" } element={ <PublicRoute><AuthLayout/></PublicRoute> }>
					<Route path={ "login" } element={ <LoginPage/> }/>
					<Route path={ "signup" } element={ <SignUpPage/> }/>
				</Route>
			</Route>
		</Routes>
	);
}