import { createQuery, QueryProps } from "../signals";
import { Client, everything } from "@genql/runtime/client";
import { Accessor, createContext, JSXElement } from "solid-js";

function fetcher( client: Client ) {
	return client.chain.query.me.get( { ...everything } );
}

export const MeContext = createContext<Accessor<Awaited<ReturnType<typeof fetcher>> | undefined>>();

export type MeQueryProps =
	Omit<QueryProps<Awaited<ReturnType<typeof fetcher>>>, "fetcher">
	& { provider?: boolean };

export function createMeQuery( { provider, ...props }: MeQueryProps ) {
	const query = createQuery( { fetcher, ...props } );

	const Provider = ( props: { children: JSXElement } ) =>
		<MeContext.Provider value = { query.data }>{ props.children }</MeContext.Provider>;
	return { Provider, ...query };
}