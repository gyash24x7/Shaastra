import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthModule } from "@shaastra/auth";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import appConfig from "./app.config";
import { MemberModule } from "../member/member.module";

@Module( {
	imports: [
		ConfigModule.forRoot( { load: [ appConfig ] } ),
		AuthModule,
		ConsulModule,
		HealthModule,
		GraphQLModule.forRoot<MercuriusFederationDriverConfig>( {
			driver: MercuriusFederationDriver,
			federationMetadata: true,
			graphiql: true,
			autoSchemaFile: true,
			context: ( request: FastifyRequest ) => ( { request } )
		} ),
		MemberModule
	]
} )
export class AppModule {}