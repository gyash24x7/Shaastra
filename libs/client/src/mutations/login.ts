import { useMutation } from "@tanstack/react-query";
import type { LoginInput } from "../../../../services/identity/src/users/commands/login.command";
import { createClient } from "@genql/runtime/client";

const genqlClient = createClient();

export const useLoginMutation = () => useMutation( {
	mutationFn: ( data: LoginInput ) => genqlClient.mutation( { login: [ { data } ] } ),
	onSuccess: ( data ) => console.log( data )
} );