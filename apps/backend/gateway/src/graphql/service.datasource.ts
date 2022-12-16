import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { GatewayContext } from "@shaastra/utils";

export class ServiceDataSource extends RemoteGraphQLDataSource<GatewayContext> {

	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<GatewayContext> ) {
		const tokenFromCookie = "req" in context ? context.req?.cookies?.identity : undefined;
		if ( !!tokenFromCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ tokenFromCookie }` );
		}
	}

	override async didReceiveResponse( { response, context }: any ) {
		const token = response.http.headers.get( "x-access-token" );
		const logout = response.http.headers.get( "x-logout" );
		if ( !!token ) {
			context.token = token;
		}

		if ( !!logout ) {
			context.logout = true;
		}
		return response;
	}
}
