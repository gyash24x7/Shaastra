import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { ServiceContext } from "./graphql.types";

export class ServiceDataSource extends RemoteGraphQLDataSource<ServiceContext> {
	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<ServiceContext> ) {
		const idCookie: string = context.req.cookies[ "identity" ];
		if ( !!idCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ idCookie }` );
		}
	}
}
