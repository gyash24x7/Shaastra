import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { CreateMemberInput, CreateMemberMutationData } from "../types";
import { gqlFetcher } from "../utils";

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

export type CreateMutationOptions = UseMutationOptions<CreateMemberMutationData, Error, CreateMemberInput>;

export function useCreateMemberMutation( options?: CreateMutationOptions ) {
	return useMutation( [ "createMember" ], gqlFetcher<CreateMemberMutationData, CreateMemberInput>( query ), options );
}