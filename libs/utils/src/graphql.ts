import type { Request, Response } from "express";
import {
	GraphQLDataSourceProcessOptions,
	IntrospectAndCompose,
	RemoteGraphQLDataSource,
	ServiceEndpointDefinition
} from "@apollo/gateway";
import { Injectable } from "@nestjs/common";
import type { GqlOptionsFactory } from "@nestjs/graphql";
import type { ApolloFederationDriverConfig, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { ApolloFederationDriver } from "@nestjs/apollo";
import { ConsulService } from "@shaastra/consul";
import { ConfigService } from "@nestjs/config";

export type GqlResolveReferenceData = {
	__typename: string;
	id: string;
}

export type GqlContext = {
	req: Request;
	res: Response;
	token?: string;
}

export const apolloServerOptions: ApolloFederationDriverConfig = {
	path: "/api/graphql",
	playground: true,
	cors: true,
	context: ( { req, res }: GqlContext ): GqlContext => (
		{ req, res }
	),
	driver: ApolloFederationDriver,
	typePaths: [ "services/identity/src/**/*.graphql" ]
};

export class AuthenticatedDataSource extends RemoteGraphQLDataSource<GqlContext> {

	override willSendRequest( { request, context }: GraphQLDataSourceProcessOptions<GqlContext> ) {
		const tokenFromCookie = context.req?.cookies?.identity;
		if ( !!tokenFromCookie ) {
			request.http?.headers.set( "Authorization", `Bearer ${ tokenFromCookie }` );
		}
	}

	override async didReceiveResponse( { response, context }: any ) {
		const token = response.http.headers.get( "x-access-token" );
		if ( !!token ) {
			context.token = token;
		}
		return response;
	}
}

@Injectable()
export class GraphQLGatewayFactory implements GqlOptionsFactory<ApolloGatewayDriverConfig> {
	constructor(
		private readonly consulService: ConsulService,
		private readonly configService: ConfigService
	) {}

	async createGqlOptions(): Promise<ApolloGatewayDriverConfig> {
		const id = this.configService.getOrThrow<string>( "app.id" );
		const registeredServices = await this.consulService.getRegisteredServices( id );

		const supergraphSdl = new IntrospectAndCompose( {
			subgraphs: registeredServices.map( service => (
				{
					name: service.ID,
					url: `http://${ service.Address }:${ service.Port }/api/graphql`
				}
			) )
		} );

		const buildService = ( { url }: ServiceEndpointDefinition ) => new AuthenticatedDataSource( { url } );

		return { server: { ...apolloServerOptions }, gateway: { supergraphSdl, buildService } };
	}
}