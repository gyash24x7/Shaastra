import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { apolloServerOptions } from "@shaastra/utils";
import { ConsulModule } from "@shaastra/consul";
import { AuthModule } from "@shaastra/auth";
import { Module } from "@nestjs/common";
import appConfig from "./app.config";
import { CqrsModule } from "@nestjs/cqrs";
import commandHandlers from "./commands";
import queryHandlers from "./queries";
import eventHandlers from "./events";
import resolvers from "./resolvers";
import { PrismaService } from "./prisma";
import { MailModule } from "@shaastra/mail";
import { HttpModule } from "@nestjs/axios";
import { HealthModule } from "@shaastra/health";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRoot( apolloServerOptions( "workforce" ) );

const imports = [
	CqrsModule,
	MailModule,
	HttpModule,
	ConfigModule,
	ConsulModule,
	HealthModule,
	AuthModule,
	GraphQLModule
];

const providers = [ PrismaService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...resolvers ];

@Module( { imports, providers } )
export class AppModule {}