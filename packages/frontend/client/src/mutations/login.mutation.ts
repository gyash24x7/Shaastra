import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { LoginInput, LoginMutationData } from "../types";
import { postFetcher } from "../utils";

export function useLoginMutation( options?: UseMutationOptions<LoginMutationData, unknown, LoginInput> ) {
	return useMutation( [ "login" ], postFetcher<LoginMutationData, LoginInput>( "auth/login" ), options );
}