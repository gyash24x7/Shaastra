import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { LoginMutationData, LoginInput } from "../types/index.js";
import { postFetcher } from "../utils/index.js";

export function useLoginMutation( options?: UseMutationOptions<LoginMutationData, unknown, LoginInput> ) {
	return useMutation( [ "login" ], postFetcher<LoginMutationData, LoginInput>( "auth/login" ), options );
}