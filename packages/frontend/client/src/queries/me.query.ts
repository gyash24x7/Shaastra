import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import superagent from "superagent";
import type { MemberPosition, Department } from "../generated/index.js";

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

export type MeQueryData = {
	readonly me: {
		readonly id: string,
		readonly name: string,
		readonly email: string,
		readonly rollNumber: string,
		readonly position: MemberPosition,
		readonly profilePic: string,
		readonly coverPic: string,
		readonly department: Department,
		readonly enabled: boolean
	}
};

export async function meQueryFetcher(): Promise<MeQueryData> {
	const response = await superagent
		.post( "http://localhost:9000/api/graphql" )
		.send( { query } )
		.withCredentials();

	if ( response.body.errors ) {
		const { message } = response.body.errors[ 0 ];
		throw new Error( message );
	}

	return response.body.data;
}

export function useMeQuery( options?: UseQueryOptions<MeQueryData> ) {
	return useQuery<MeQueryData>( [ "me" ], meQueryFetcher, options );
}
