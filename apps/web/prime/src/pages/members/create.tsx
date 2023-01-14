import { Flex, VStack } from "@shaastra/ui";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMount } from "react-use";

export default function CreateMemberPage() {
	const [ searchParams, setSearchParams ] = useSearchParams();
	const navigate = useNavigate();
	const [ hash, setHash ] = useState( "" );
	const [ userId, setUserId ] = useState( "" );

	useMount( () => {
		if ( !searchParams.has( "hash" ) || !searchParams.has( "userId" ) ) {
			navigate( "/auth/login" );
		}
		setHash( searchParams.get( "hash" )! );
		setUserId( searchParams.get( "userId" )! );
		setSearchParams();
	} );

	return (
		<Flex className={ "h-screen" }>
			<div className={ "flex-grow auth-bg h-screen" }></div>
			<div className={ "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				<VStack className={ "h-screen p-8" }>
					<img
						src={ "/images/DarkLogo.png" }
						alt={ "Shaastra Logo" }
						className={ "w-60 h-auto mx-auto my-4" }
					/>
					<h2 className={ "font-light text-3xl" }>MEMBER DETAILS</h2>
					<p>UserId: { userId }</p>
					<p>Hash: { hash }</p>
				</VStack>
			</div>
		</Flex>
	);
}