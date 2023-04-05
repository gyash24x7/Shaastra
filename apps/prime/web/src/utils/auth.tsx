import { logoutMutationFn, meQueryFn } from "@api/client";
import { Flex, Spinner } from "@prime/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { Else, If, Then } from "react-if";
import { genqlClient } from "./client";

export type AuthContextType = {
	isLoggedIn: boolean;
	loggedInMember: Awaited<ReturnType<ReturnType<typeof meQueryFn>>>["me"] | undefined;
	logout: () => Promise<void>
	login: () => Promise<void>
};

const AuthContext = createContext<AuthContextType>( {
	isLoggedIn: false,
	loggedInMember: undefined,
	logout: async () => {},
	login: async () => {}
} );

export const AuthProvider = ( props: { children: ReactNode } ) => {
	const [ isLoggedIn, setIsLoggedIn ] = useState( false );

	const { isLoading, data, refetch } = useQuery(
		[ "me" ],
		meQueryFn( genqlClient ),
		{ onSuccess: () => setIsLoggedIn( true ) }
	);

	const { mutateAsync } = useMutation( {
		mutationFn: logoutMutationFn( genqlClient ),
		onSuccess: async () => setIsLoggedIn( false )
	} );

	const logout = async () => {
		await mutateAsync();
	};

	const login = async () => {
		await refetch();
	};

	return (
		<If condition={ isLoading }>
			<Then>
				<Flex justify={ "center" } align={ "center" }>
					<Spinner size={ "2xl" } appearance={ "primary" }/>
				</Flex>
			</Then>
			<Else>
				<AuthContext.Provider
					value={ { isLoggedIn, loggedInMember: isLoggedIn ? data?.me : undefined, logout, login } }
				>
					{ props.children }
				</AuthContext.Provider>
			</Else>
		</If>
	);
};

export function useAuth() {
	return useContext( AuthContext );
}
