import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/auth.layout";
import HomeLayout from "../layouts/home.layout";
import HomePage from "../pages";
import LoginPage from "../pages/auth/login";
import SignUpPage from "../pages/auth/signup";

export function AppRoutes() {
	return (
		<Routes>
			<Route path={ "/auth" } element={ <AuthLayout/> }>
				<Route path={ "login" } element={ <LoginPage/> }/>
				<Route path={ "signup" } element={ <SignUpPage/> }/>
			</Route>
			<Route path={ "/" } element={ <HomeLayout/> }>
				<Route path={ "" } element={ <HomePage/> }/>
			</Route>
		</Routes>
	);
}