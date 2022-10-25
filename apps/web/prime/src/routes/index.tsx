import { createBrowserRouter } from "react-router-dom";
import IndexPage from "../pages";
import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";

export const router = createBrowserRouter( [
	{ path: "/", element: <IndexPage /> },
	{ path: "/login", element: <LoginPage /> },
	{ path: "/signup", element: <SignupPage /> }
] );