import { Fragment } from "react";
import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function HomeLayout() {
	const outlet = useOutlet();
	const { isLoggedIn } = useAuth();

	if ( !isLoggedIn ) {
		return <Navigate to={ "/auth/login" }/>;
	}

	return <Fragment>{ outlet }</Fragment>;
}