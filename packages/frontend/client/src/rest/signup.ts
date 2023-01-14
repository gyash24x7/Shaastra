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

export type SignupMutationVariables = {
	name: string;
	email: string;
	password: string;
	roles: string[];
	username: string;
};

export const useSignupMutation = ( options?: UseMutationOptions<User, unknown, SignupMutationVariables> ) => {
	return useMutation(
		[ "signup" ],
		async ( variables: SignupMutationVariables ) => {
			const response = await superagent
				.post( "http://localhost:9000/api/auth/signup" )
				.send( variables )
				.withCredentials();

			return response.body;
		},
		options
	);
};