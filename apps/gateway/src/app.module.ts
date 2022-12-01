import { ConfigModule as NestConfigModule } from "@nestjs/config";
import appConfig from "./app.config.js";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { ConsulModule } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { CookiePlugin } from "./cookie.plugin.js";
import { Module } from "@nestjs/common";
import { apolloServerOptions, AuthenticatedDataSource } from "@shaastra/utils";
import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { readFileSync } from "fs";
import path from "path";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const supergraphSdl = readFileSync(
	path.join( process.cwd(), "node_modules/@shaastra/schema/gateway.graphql" )
).toString();

const buildService = ( { url }: ServiceEndpointDefinition ) => new AuthenticatedDataSource( { url } );

const GraphQLModule = NestGraphQLModule.forRoot<ApolloGatewayDriverConfig>( {
	server: { ...apolloServerOptions( "gateway" ) },
	driver: ApolloGatewayDriver,
	gateway: { supergraphSdl, buildService }
} );

const imports = [ ConfigModule, ConsulModule, HealthModule, GraphQLModule ];
const providers = [ CookiePlugin ];

@Module( { imports, providers } )
export class AppModule {}