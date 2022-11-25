import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { mercuriusOptions } from "@shaastra/utils";
import { ConsulModule } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { AuthModule } from "@shaastra/auth";
import { Module } from "@nestjs/common";
import appConfig from "./app.config";
import { CqrsModule } from "@nestjs/cqrs";
import commandHandlers from "./commands";
import queryHandlers from "./queries";
import eventHandlers from "./events";
import resolvers from "./resolvers";
import { PrismaService } from "./prisma";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRoot( mercuriusOptions );

@Module( {
	imports: [ ConfigModule, ConsulModule, HealthModule, GraphQLModule, AuthModule, CqrsModule ],
	providers: [ PrismaService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...resolvers ]
} )
export class AppModule {}