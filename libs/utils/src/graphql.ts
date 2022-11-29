import type { Request, Response } from "express";
import type { ApolloFederationDriverConfig } from "@nestjs/apollo";
import { ApolloFederationDriver } from "@nestjs/apollo";
import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import { loadSchema, loadSchemaSync, loadTypedefs, loadTypedefsSync } from "@graphql-tools/load";
import { join } from "path";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import type { GraphQLSchema } from "graphql/type";
import type { DocumentNode } from "graphql";

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

export interface Source {
	document?: DocumentNode;
	schema?: GraphQLSchema;
	rawSDL?: string;
	location?: string;
}

export async function loadServiceTypedefs( serviceName: string ): Promise<Source[]> {
	return loadTypedefs(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

export function loadServiceTypedefsSync( serviceName: string ): Source[] {
	return loadTypedefsSync(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

export async function loadServiceSchema( serviceName: string ) {
	return loadSchema(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

export function loadServiceSchemaSync( serviceName: string ): GraphQLSchema {
	return loadSchemaSync(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

export const apolloServerOptions = ( serviceName: string ): ApolloFederationDriverConfig => {
	return {
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
		autoSchemaFile: false,
		schema: serviceName === "gateway" ? undefined : loadServiceSchemaSync( serviceName )
	};
};

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
