import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import superagent from "superagent";
import type { LoginInput } from "../types/inputs.js";
import type { LoginMutationData } from "../types/responses.js";

export async function loginMutationFetcher( variables: LoginInput ): Promise<LoginMutationData> {
	const response = await superagent
		.post( "http://localhost:9000/api/auth/login" )
		.send( variables )
		.withCredentials();

	return response.body;
}

export function useLoginMutation( options?: UseMutationOptions<LoginMutationData, unknown, LoginInput> ) {
	return useMutation( [ "login" ], loginMutationFetcher, options );
}