import type { FastifyReply, FastifyRequest } from "fastify";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from "@apollo/gateway";
import { join } from "path";
import type { UserAuthInfo } from "@shaastra/auth";
import type { IncomingHttpHeaders } from "http";
import { loadSchema, loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { printSchema } from "graphql/utilities";
import type { ConsulRegisteredService } from "@shaastra/consul";

declare module "mercurius" {
	interface MercuriusContext extends GqlContext {}
}

export type GqlResolveReferenceData = {
	__typename: string;
	id: string;
}

export type GqlContext = {
	req: FastifyRequest & { user?: UserAuthInfo };
	res: FastifyReply;
	token?: string;
	logout?: boolean;
}

export const mercuriusOptions = ( serviceName?: string ): MercuriusFederationDriverConfig => (
	{
		path: "/api/graphql",
		graphiql: true,
		driver: MercuriusFederationDriver,
		context: ( req: FastifyRequest, res: FastifyReply ): GqlContext => (
			{ req, res }
		),
		federationMetadata: true,
		autoSchemaFile: false,
		schema: !!serviceName ? loadServiceSchemaSync( serviceName ) : undefined,
		buildSchemaOptions: {
			dateScalarMode: "isoDate",
			noDuplicatedFields: false
		}
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

export async function loadServiceSchema( serviceName: string ) {
	return loadSchema(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

export function loadServiceSchemaSync( serviceName: string ) {
	return loadSchemaSync(
		join( process.cwd(), "node_modules/@shaastra/schema", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ], assumeValid: true, assumeValidSDL: true }
	);
}

type Dict<T> = Record<string, T>

export async function buildService( name: string, registeredServices: Dict<ConsulRegisteredService> ) {
	const service = registeredServices[ name ];
	const schema = await loadServiceSchema( name ).then( printSchema );
	const url = Object.keys( registeredServices ).includes( name )
		? `http://${ service.Address }:${ service.Port }/api/graphql`
		: [];

	return { name, url, rewriteHeaders, setResponseHeaders, schema };
}

export function rewriteHeaders( headers: IncomingHttpHeaders, context: GqlContext ) {
	const tokenFromCookie = "req" in context ? context.req?.cookies[ "identity" ] : undefined;
	if ( !!tokenFromCookie ) {
		headers.authorization = `Bearer ${ tokenFromCookie }`;
	}
	return headers;
}

export function setResponseHeaders( reply: FastifyReply ) {
	const token = reply.getHeader( "x-access-token" );
	const logout = reply.getHeader( "x-logout" );

	if ( !!token ) {
		reply.setCookie( "identity", token as string );
	}

	if ( !!logout ) {
		reply.clearCookie( "identity" );
	}
}
