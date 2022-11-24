import type { Request, Response } from "express";
import type { ApolloFederationDriverConfig } from "@nestjs/apollo";
import { ApolloFederationDriver } from "@nestjs/apollo";
import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import { join } from "path";

export type GqlResolveReferenceData = {
	__typename: string;
	id: string;
}

export type GqlContext = {
	req: Request;
	res: Response;
	token?: string;
	logout?: boolean;
}

export const apolloServerOptions = ( serviceName: string ): ApolloFederationDriverConfig => (
	{
		path: "/api/graphql",
		playground: true,
		cors: {
			origin: "http://localhost:3000",
			credentials: true
		},
		context: ( { req, res }: GqlContext ): GqlContext => (
			{ req, res }
		),
		driver: ApolloFederationDriver,
		autoSchemaFile: join( process.cwd(), "../../schema/subgraphs", `${ serviceName }.graphql` )
	}
);

export class AuthenticatedDataSource extends RemoteGraphQLDataSource<GqlContext> {

	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<GqlContext> ) {
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
