import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthModule } from "@shaastra/auth";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import { CqrsModule } from "@nestjs/cqrs";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import { MemberResolver } from "../resolvers/member.resolver";
import { CreateMemberHandler } from "../handlers/create-member";
import { GetMembersQueryHandler } from "../handlers/get-members";
import appConfig from "./app.config";
import { WorkforcePrismaService } from "./prisma.service";

@Module( {
	imports: [
		AuthModule,
		ConfigModule.forRoot( { load: [ appConfig ] } ),
		HealthModule,
		ConsulModule,
		CqrsModule,
		GraphQLModule.forRoot<MercuriusFederationDriverConfig>( {
			driver: MercuriusFederationDriver,
			federationMetadata: true,
			graphiql: true,
			autoSchemaFile: true,
			context: ( request: FastifyRequest ) => ( { request } )
		} )
	],
	controllers: [],
	providers: [ WorkforcePrismaService, MemberResolver, CreateMemberHandler, GetMembersQueryHandler ]
} )
export class AppModule {}