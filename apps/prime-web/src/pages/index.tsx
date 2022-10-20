import { useAuth0 } from "@auth0/auth0-react";
import { Button, Loader } from "@mantine/core";
import { Fragment } from "react";

export default () => {
	const {
		isAuthenticated,
		isLoading,
		getAccessTokenSilently,
		logout,
		loginWithRedirect,
		error,
		user
	} = useAuth0();

	if ( isLoading ) {
		return <Loader />;
	}

	if ( error ) {
		return <div>Some Error!</div>;
	}

	if ( !isAuthenticated ) {
		return <Button onClick = { () => loginWithRedirect() }>Log In</Button>;
	}

	return (
		<Fragment>
			<h2>{ user?.name }</h2>
			<Button onClick = { () => logout() }>Log Out</Button>
			<Button onClick = { () => getAccessTokenSilently().then( console.log ) }>Get Access Token</Button>
		</Fragment>
	)
}