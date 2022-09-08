import { NestFactory } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ConfigModule, registerAs } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import { MemberResolver } from "./resolvers/member.resolver";
import { CreateMemberHandler } from "./handlers/create-member";
import { GetMembersQueryHandler } from "./handlers/get-members";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthModule } from "@shaastra/auth";
import { PrismaModule, WorkforcePrismaService } from "@shaastra/prisma";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import type { AppConfig } from "@shaastra/utils";

const appConfig = registerAs<AppConfig>( "app", () => ( {
	id: "workforce",
	name: "Shaastra Workforce",
	pkg: "@shaastra/workforce",
	port: 8000,
	address: "localhost",
	auth: {
		domain: process.env[ "AUTH0_DOMAIN" ]!,
		clientId: process.env[ "AUTH0_CLIENT_ID" ]!,
		clientSecret: process.env[ "AUTH0_CLIENT_SECRET" ]!,
		audience: process.env[ "AUTH0_AUDIENCE" ]!
	},
	consul: {
		host: process.env[ "CONSUL_URL" ] || "localhost",
		port: process.env[ "CONSUL_PORT" ] || "8500"
	},
	prisma: {
		dbUrl: process.env[ "WORKFORCE_DB_URL" ]!
	}
} ) );

@Module( {
	imports: [
		AuthModule,
		PrismaModule,
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
	providers: [ MemberResolver, CreateMemberHandler, GetMembersQueryHandler ]
} )
export class AppModule {}

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );

	const prismaService = app.get( WorkforcePrismaService );
	await prismaService.enableShutdownHooks( app );

	await app.listen( 8000 );

	const logger = new Logger( "Bootstrap" );
	logger.log( "Workforce Service running on http://localhost:8000/graphql" );
}

bootstrap().then();
