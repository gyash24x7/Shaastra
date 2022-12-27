import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { GatewayContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export class ServiceDataSource extends RemoteGraphQLDataSource<GatewayContext> {

	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<GatewayContext> ) {
		logger.debug( `Id Cookie: ${ context.idCookie }` );
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
