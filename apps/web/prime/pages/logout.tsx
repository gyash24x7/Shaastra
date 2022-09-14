import { Button } from "@mantine/core";
import Link from "next/link";
import { Fragment } from "react";

export default () => {
	return (
		<Fragment>
			<h1>Logged out!</h1>
			<Link href = "/api/auth/login" passHref>
				<Button component = "a">Login</Button>
			</Link>
		</Fragment>
	);
}