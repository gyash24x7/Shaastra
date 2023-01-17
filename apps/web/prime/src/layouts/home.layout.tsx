import { useClient, useMeQuery } from "@shaastra/client";
import { Spinner, Flex } from "@shaastra/ui";
import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../auth/provider.js";

export default function HomeLayout() {
	const outlet = useOutlet();
	const { data, isLoading, isError, error } = useMeQuery();
	const client = useClient();

	const refresh = async () => {
		await client.invalidateQueries( { queryKey: [ "me" ] } );
	};

	if ( isLoading ) {
		return (
			<Flex justify={ "center" } align={ "center" }>
				<Spinner size={ "2xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	if ( isError ) {
		console.log( `Me Query Error: ${ error }` );
	}

	return <AuthProvider data={ data?.me } refresh={ refresh }>{ outlet }</AuthProvider>;
}