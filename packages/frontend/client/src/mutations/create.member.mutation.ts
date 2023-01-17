import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import superagent from "superagent";
import type { Department, MemberPosition } from "../generated/index.js";
import type { User } from "./signup.mutation.js";

export type CreateMemberMutationData = {
	createMember: {
		id: string,
		name: string,
		email: string,
		rollNumber: string,
		profilePic: string,
		position: MemberPosition,
		department: Department,
		about: string
	}
};

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

export type CreateMemberMutationVariables = {
	userId: string;
	hash: string;
	department: Department;
	mobile: string;
}

export async function createMemberMutationFetcher( variables: CreateMemberMutationVariables ): Promise<CreateMemberMutationData> {
	const { userId, hash, mobile, department } = variables;

	let response = await superagent
		.post( "http://localhost:9000/api/auth/verify-member-create" )
		.send( { userId, hash } )
		.withCredentials();

	const { username: rollNumber, email, name }: User = response.body;

	response = await superagent
		.post( "http://localhost:9000/api/graphql" )
		.send( { query, variables: { mobile, department, name, email, userId, rollNumber } } )
		.withCredentials();

	if ( response.body.errors ) {
		const { message } = response.body.errors[ 0 ];
		throw new Error( message );
	}

	return response.body.data;
}

export type CreateMutationOptions = UseMutationOptions<CreateMemberMutationData, unknown, CreateMemberMutationVariables>;

export function useCreateMemberMutation( options?: CreateMutationOptions ) {
	return useMutation( [ "createMember" ], createMemberMutationFetcher, options );
}