import { ConfigModule } from "@nestjs/config";
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
	context: ( request: FastifyRequest ) => ( { request } )
} );

@Module( {
	imports: [
		ConfigModule.forRoot( {
			load: [ appConfig ],
			isGlobal: true
		} ),
		AuthModule,
		ConsulModule,
		HealthModule,
		GraphQLModule,
		MemberModule
	]
} )
export class AppModule {}