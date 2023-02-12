import superagent, { ResponseError, Response } from "superagent";

const BASE_URL = "http://localhost:9000/api/";

export function postFetcher<R, D extends Object>( path: string ) {
	return ( data: D ) => new Promise<R>( ( resolve, reject ) => {
		superagent.post( BASE_URL + path )
			.send( data )
			.withCredentials()
			.end( ( err: ResponseError, res: Response ) => {
				if ( !!err ) {
					reject( err );
				} else {
					resolve( res.body );
				}
			} );
	} );
}

export function gqlFetcher<R, I = any>( query: string ) {
	return async ( variables?: I ) => {
		const fetcher = postFetcher<{ data: R }, { query: string, variables: I | {} }>( "graphql" );
		const { data } = await fetcher( { query, variables: variables || {} } );
		return data;
	};
}