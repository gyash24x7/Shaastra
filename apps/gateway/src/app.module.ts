import { ConfigModule as NestConfigModule } from "@nestjs/config/dist/config.module";
import appConfig from "./app.config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { ConfigService } from "@nestjs/config";
import { GraphQLGatewayFactory } from "@shaastra/utils/graphql";
import { HealthModule } from "@shaastra/health";
import { CookiePlugin } from "./cookie.plugin";
import { Module } from "@nestjs/common";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

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