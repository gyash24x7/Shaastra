import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthModule } from "@shaastra/auth";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import appConfig from "./app.config";
import { MemberModule } from "../member/member.module";

const GraphQLModule = NestGraphQLModule.forRoot<MercuriusFederationDriverConfig>( {
	driver: MercuriusFederationDriver,
	federationMetadata: true,
	graphiql: true,
	autoSchemaFile: true,
	context: (
		( request: FastifyRequest ) => (
			{ request }
		)
	) as any
} );

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

@Module( {
	imports: [ ConfigModule, AuthModule, ConsulModule, HealthModule, GraphQLModule, MemberModule ]
} )
export class AppModule {}