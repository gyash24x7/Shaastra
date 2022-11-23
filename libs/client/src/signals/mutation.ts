import { createSignal } from "solid-js";
import type { Client } from "../generated";
import { useClient } from "../client";
import type { GqlError } from "./index";

export type MutationProps<T, K> = {
	action: ( client: Client, data: K ) => Promise<T>
	onSuccess?: ( data: T ) => void | Promise<void>;
	onError?: ( err: GqlError ) => void | Promise<void>;
}


export function createMutation<T, K>( { action, onError, onSuccess }: MutationProps<T, K> ) {
	const [ loading, setLoading ] = createSignal( false );
	const [ data, setData ] = createSignal<T>();
	const [ error, setError ] = createSignal<GqlError>();
	const client = useClient();

	const mutate = ( data: K ) => {
		setLoading( true );
		action( client!, data ).then( ( d ) => {
			setData( () => d );
			if ( onSuccess ) {
				onSuccess( d );
			}
		} ).catch( ( err: Error ) => {
			const gqlError: GqlError = JSON.parse( err.message.substring( err.message.indexOf( "{" ) ) );
			setError( gqlError );
			if ( onError ) {
				onError( gqlError );
			}
		} ).finally( () => setLoading( false ) );
	};

	return { mutate, loading, data, error };
}