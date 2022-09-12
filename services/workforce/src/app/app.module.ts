import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthModule } from "@shaastra/auth";
import { HealthModule } from "@shaastra/health";
import { ConsulModule } from "@shaastra/consul";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import type { FastifyRequest } from "fastify";
import appConfig from "./app.config";
import { MemberModule } from "../member/member.module";
import { PrismaModule } from "@shaastra/prisma";

@Module( {
	imports: [
		ConfigModule.forRoot( {
			load: [ appConfig ],
			isGlobal: true
		} ),
		AuthModule.forRootAsync( {
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: ( configService: ConfigService ) => ( {
				audience: configService.get<string>( "app.auth.audience" )!,
				domain: configService.get<string>( "app.auth.domain" )!
			} )
		} ),
		ConsulModule.forRootAsync( {
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: ( configService: ConfigService ) => ( {
				host: configService.get( "app.consul.host" )!,
				port: configService.get( "app.consul.port" )!,
				registerOptions: {
					id: configService.get<string>( "app.id" )!,
					name: configService.get<string>( "app.name" )!,
					port: configService.get<number>( "app.port" )!,
					address: configService.get<string>( "app.address" )!,
					url: configService.get<string>( "app.url" )!,
					meta: { pkg: configService.get<string>( "app.pkg" )! }
				}
			} )
		} ),
		HealthModule.forRootAsync( {
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: ( configService: ConfigService ) => ( {
				baseUrl: configService.get<string>( "app.url" )!
			} )
		} ),
		PrismaModule.forServiceAsync( "workforce", {
			isGlobal: true,
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: ( configService: ConfigService ) => ( {
				name: "workforce",
				url: configService.get<string>( "WORKFORCE_DB_URL" )!
			} )
		} ),
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