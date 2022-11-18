import { Client, createClient } from "@genql/runtime/client";
import { createContext, JSXElement, useContext } from "solid-js";

const ClientContext = createContext<Client>();

export function ClientProvider( props: { children: JSXElement } ) {
	return (
		<ClientContext.Provider
			value = { createClient( {
				url: "http://localhost:9000/api/graphql",
				credentials: "include"
			} ) }
		>
			{ props.children }
		</ClientContext.Provider>
	);
}

export function useClient() {
	return useContext( ClientContext );
}