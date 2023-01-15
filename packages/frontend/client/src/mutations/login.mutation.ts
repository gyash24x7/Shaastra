import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import superagent from "superagent";
import type { User } from "./signup.mutation.js";

export type LoginMutationVariables = {
	password: string;
	username: string;
};

export async function fetcher( variables: LoginMutationVariables ) {
	const response = await superagent
		.post( "http://localhost:9000/api/auth/login" )
		.send( variables )
		.withCredentials();

	return response.body;
}

export default function useLoginMutation( options?: UseMutationOptions<User, unknown, LoginMutationVariables> ) {
	return useMutation( [ "login" ], fetcher, options );
};