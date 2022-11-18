import { createEffect, createSignal } from "solid-js";
import type { Client } from "@genql/runtime/client";
import { useClient } from "../client";

export type QueryProps<T> = {
	fetcher: ( client: Client ) => Promise<T>,
	provider?: boolean,
	onSuccess?: ( data: T ) => void | Promise<void>;
	onError?: ( err: Error ) => void | Promise<void>;
};

export function createQuery<T>( { fetcher, onError, onSuccess }: QueryProps<T> ) {
	const [ loading, setLoading ] = createSignal( true );
	const [ data, setData ] = createSignal<T>();
	const [ error, setError ] = createSignal<Error>();
	const client = useClient();

	createEffect( () => {
		fetcher( client! ).then( ( d ) => {
			setData( () => d );
			if ( onSuccess ) {
				onSuccess( d );
			}
		} ).catch( ( err: Error ) => {
			setError( err );
			if ( onError ) {
				onError( err );
			}
		} ).finally( () => setLoading( false ) );
	} );

	return { data, loading, error };
}
