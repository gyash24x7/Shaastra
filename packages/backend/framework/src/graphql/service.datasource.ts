import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { ServiceContext } from "../context";
import { logger } from "../logger";

export class ServiceDataSource extends RemoteGraphQLDataSource<ServiceContext> {

	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<ServiceContext> ) {
		if ( !!context.idCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ context.idCookie }` );
		}
	}

	override async didReceiveResponse( { response, context }: any ) {
		const token = response.http.headers.get( "x-access-token" );
		const logout = response.http.headers.get( "x-logout" );
		if ( !!token ) {
			logger.debug( `Received Access Token...` );
			context.token = token;
		}

		if ( !!logout ) {
			logger.debug( `Received Logout...` );
			context.logout = true;
		}
		return response;
	}
}
