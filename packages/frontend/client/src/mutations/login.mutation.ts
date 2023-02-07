import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import superagent from "superagent";
import type { LoginMutationData, LoginInput } from "../types/index.js";

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