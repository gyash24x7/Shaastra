import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { MeQueryData } from "../types/index.js";
import { gqlFetcher } from "../utils/index.js";

const query = `
	query me {
		me {
			id
			name
        	email
        	rollNumber
        	position
        	profilePic
        	coverPic
        	department
        	enabled
    	}
	}
`;

export function useMeQuery( options?: UseQueryOptions<MeQueryData> ) {
	return useQuery<MeQueryData>( [ "me" ], gqlFetcher<MeQueryData>( query ), options );
}
