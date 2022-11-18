import { createSignal } from "solid-js";
import type { Client } from "@genql/runtime/client";
import { useClient } from "../client";

export type MutationProps<T, K> = {
	action: ( client: Client, data: K ) => Promise<T>
	onSuccess?: ( data: T ) => void | Promise<void>;
	onError?: ( err: Error ) => void | Promise<void>;
}


export function createMutation<T, K>( { action, onError, onSuccess }: MutationProps<T, K> ) {
	const [ loading, setLoading ] = createSignal( false );
	const [ data, setData ] = createSignal<T>();
	const [ error, setError ] = createSignal<Error>();
	const client = useClient();

	const mutate = ( data: K ) => {
		setLoading( true );
		action( client!, data ).then( ( d ) => {
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
	};

	return { mutate, loading, data, error };
}