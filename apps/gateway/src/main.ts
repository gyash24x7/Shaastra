import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";
import config from "./config";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import type { ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { ApolloGatewayDriver } from "@nestjs/apollo";
import { CookiePlugin } from "./plugins/cookie.plugin";
import { GraphQLGatewayFactory } from "@shaastra/utils/graphql";
import { bootstrap } from "@shaastra/utils/nest";

const ConfigModule = NestConfigModule.forRoot( { load: [ config ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloGatewayDriverConfig>( {
	driver: ApolloGatewayDriver,
	imports: [ ConsulModule, ConfigModule ],
	inject: [ ConsulService, ConfigService ],
	useClass: GraphQLGatewayFactory
} );

const imports = [ ConfigModule, ConsulModule, HealthModule, GraphQLModule ];
const providers = [ CookiePlugin ];

@Module( { imports, providers } )
export class AppModule {}

bootstrap( AppModule ).then();
