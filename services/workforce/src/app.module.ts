import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { mercuriusOptions } from "@shaastra/utils";
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
import { MercuriusFederationDriver } from "@nestjs/mercurius";
import { join } from "path";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRootAsync( {
	driver: MercuriusFederationDriver,
	imports: [ ConfigModule ],
	inject: [ ConfigService ],
	useFactory( configService: ConfigService ) {
		const serviceName = configService.getOrThrow<string>( "app.id" );
		return {
			...mercuriusOptions,
			autoSchemaFile: join( process.cwd(), "../../schema", `subgraphs/${ serviceName }.graphql` )
		};
	}
} );

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