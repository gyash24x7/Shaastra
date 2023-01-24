import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import superagent from "superagent";

export type User = {
	id: string
	name: string
	email: string
	username: string
	password: string
	verified: boolean
	roles: string[]
}

export type LoginMutationVariables = {
	password: string;
	username: string;
};

export async function loginMutationFetcher( variables: LoginMutationVariables ): Promise<User> {
	const response = await superagent
		.post( "http://localhost:9000/api/auth/login" )
		.send( variables )
		.withCredentials();

	return response.body;
}

export function useLoginMutation( options?: UseMutationOptions<User, unknown, LoginMutationVariables> ) {
	return useMutation( [ "login" ], loginMutationFetcher, options );
}