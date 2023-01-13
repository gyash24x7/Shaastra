import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { ServiceContext } from "../context/index.js";

export class ServiceDataSource<P> extends RemoteGraphQLDataSource<ServiceContext<P>> {
	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<ServiceContext<P>> ) {
		if ( !!context.idCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ context.idCookie }` );
		}
	}
}
