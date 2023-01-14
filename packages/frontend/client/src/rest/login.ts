import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import superagent from "superagent";
import type { User } from "./signup";

export type LoginMutationVariables = {
	password: string;
	username: string;
};

export const useLoginMutation = ( options?: UseMutationOptions<User, unknown, LoginMutationVariables> ) => {
	return useMutation(
		[ "login" ],
		async ( variables: LoginMutationVariables ) => {
			const response = await superagent
				.post( "http://localhost:9000/api/auth/login" )
				.send( variables )
				.withCredentials();

			return response.body;
		},
		options
	);
};