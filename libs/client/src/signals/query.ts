import { createEffect, createSignal } from "solid-js";
import type { Client } from "@genql/runtime/client";
import { useClient } from "../client";
import type { GqlError } from "./index";

export type QueryProps<T> = {
	fetcher: ( client: Client ) => Promise<T>,
	provider?: boolean,
	onSuccess?: ( data: T ) => void | Promise<void>;
	onError?: ( err: GqlError ) => void | Promise<void>;
};

export function createQuery<T>( { fetcher, onError, onSuccess }: QueryProps<T> ) {
	const [ loading, setLoading ] = createSignal( true );
	const [ data, setData ] = createSignal<T>();
	const [ error, setError ] = createSignal<GqlError>();
	const client = useClient();

	createEffect( () => {
		fetcher( client! ).then( ( d ) => {
			setData( () => d );
			if ( onSuccess ) {
				onSuccess( d );
			}
		} ).catch( ( err ) => {
			const gqlError: GqlError = JSON.parse( err.message.substring( err.message.indexOf( "{" ) ) );
			setError( gqlError );
			if ( onError ) {
				onError( gqlError );
			}
		} ).finally( () => setLoading( false ) );
	} );

	return { data, loading, error };
}
