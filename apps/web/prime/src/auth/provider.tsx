import type { MeQueryData } from "@shaastra/client";
import { createContext, ReactNode, useMemo, useContext } from "react";

export type AuthContextType =
	{ isLoggedIn: true; loggedInMember: MeQueryData["me"]; refresh: () => Promise<void> }
	| { isLoggedIn: false, loggedInMember: undefined; refresh: () => Promise<void> };

const AuthContext = createContext<AuthContextType>( null! );

export type AuthProviderProps = {
	children: ReactNode;
	data?: MeQueryData["me"];
	refresh: () => Promise<void>;
}

export function AuthProvider( props: AuthProviderProps ) {

	const authContextValue = useMemo<AuthContextType>( () => {
		if ( !!props.data ) {
			return { isLoggedIn: true, loggedInMember: props.data, refresh: props.refresh };
		} else {
			return { isLoggedIn: false, loggedInMember: undefined, refresh: props.refresh };
		}
	}, [ props.data ] );

	return <AuthContext.Provider value={ authContextValue }>{ props.children }</AuthContext.Provider>;
}

export function useAuth() {
	return useContext( AuthContext );
}