import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import appConfig from "./app.config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import { UserModule } from "../user/user.module";

const GraphQLModule = NestGraphQLModule.forRoot<MercuriusFederationDriverConfig>( {
	driver: MercuriusFederationDriver,
	federationMetadata: true,
	graphiql: true,
	autoSchemaFile: true,
	context: ( request: FastifyRequest ) => ( { request } )
} );

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

@Module( {
	imports: [ ConfigModule, ConsulModule, HealthModule, GraphQLModule, UserModule ]
} )
export class AppModule {}