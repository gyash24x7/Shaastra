import type { Client, LoginInput } from "../generated";
import { createMutation, MutationProps } from "../signals";

function action( client: Client, data: LoginInput ) {
	return client.chain.mutation.login( { data } ).get();
}

export function createLoginMutation( props: Omit<MutationProps<boolean, LoginInput>, "action"> = {} ) {
	return createMutation<boolean, LoginInput>( { ...props, action } );
}