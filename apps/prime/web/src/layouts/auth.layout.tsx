import { Flex } from "@prime/ui";
import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function AuthLayout() {
	const outlet = useOutlet();

	const { isLoggedIn } = useAuth();
	if ( isLoggedIn ) {
		return <Navigate to={ "/" }/>;
	}
	
	return (
		<Flex className={ "h-screen" }>
			<div className={ "flex-grow auth-bg h-screen" }></div>
			<div className={ "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				{ outlet }
			</div>
		</Flex>
	);
}