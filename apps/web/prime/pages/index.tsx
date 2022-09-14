import { Button, Loader } from "@mantine/core";
import { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default () => {
	const { isLoading, isAuthenticated, error, loginWithRedirect, user, logout } = useAuth0();

	if ( isLoading ) {
		return <Loader/>;
	}

	if ( !!error || !isAuthenticated ) {
		return <Button onClick = { () => loginWithRedirect() }>Login</Button>;
	}

	return (
		<Fragment>
			<h1>Hello { user?.name }!</h1>
			<Button onClick = { () => logout() }>Logout</Button>
		</Fragment>
	);
}