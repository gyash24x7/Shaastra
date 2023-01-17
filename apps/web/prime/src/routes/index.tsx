import type { ReactNode } from "react";
import { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../auth/provider.js";
import AuthLayout from "../layouts/auth.layout.js";
import HomeLayout from "../layouts/home.layout.js";
import LoginPage from "../pages/auth/login.js";
import SignUpPage from "../pages/auth/signup.js";
import HomePage from "../pages/index.js";
import CreateMemberPage from "../pages/members/create.js";

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
				<Route path={ "members/create" } element={ <PublicRoute><CreateMemberPage/></PublicRoute> }/>
			</Route>
		</Routes>
	);
}