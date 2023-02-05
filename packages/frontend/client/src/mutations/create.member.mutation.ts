import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import superagent from "superagent";
import type { CreateMemberInput } from "../types/inputs.js";
import type { CreateMemberMutationData } from "../types/responses.js";

export const query = `
    mutation createMember(
    	$name: String!,
    	$email: String!,
    	$mobile: String!,
    	$department: Department!,
    	$rollNumber: String!,
    	$userId: String!
    ) {
    	createMember( data: {
    		name: $name,
    		email: $email,
    		mobile: $mobile,
    		rollNumber: $rollNumber,
    		department: $department,
    		userId: $userId
    	}) {
    		id
    		name
    		email
    		rollNumber
    		profilePic
    		position
    		department
    		about
  		}
	}
`;

export async function createMemberMutationFetcher( variables: CreateMemberInput ): Promise<CreateMemberMutationData> {
	const response = await superagent
		.post( "http://localhost:9000/api/graphql" )
		.send( { query, variables } )
		.withCredentials();

	if ( response.body.errors ) {
		const { message } = response.body.errors[ 0 ];
		throw new Error( message );
	}

	return response.body.data;
}

export type CreateMutationOptions = UseMutationOptions<CreateMemberMutationData, unknown, CreateMemberInput>;

export function useCreateMemberMutation( options?: CreateMutationOptions ) {
	return useMutation( [ "createMember" ], createMemberMutationFetcher, options );
}