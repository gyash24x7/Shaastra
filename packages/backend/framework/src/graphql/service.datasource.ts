import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import type { ServiceContext } from "../context/index.js";

export class ServiceDataSource<P> extends RemoteGraphQLDataSource<ServiceContext<P>> {
	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<ServiceContext<P>> ) {
		const idCookie: string = context.req.cookies[ "identity" ];
		if ( !!idCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ idCookie }` );
		}
	}
}
