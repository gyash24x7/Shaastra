import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages/index";
import ErrorPage from "./pages/error";

export const router = createBrowserRouter( [
	{ path: "/", element: <IndexPage/>, errorElement: <ErrorPage/> }
] )