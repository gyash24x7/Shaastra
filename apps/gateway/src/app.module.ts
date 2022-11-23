import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./app.config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { CookiePlugin } from "./cookie.plugin";
import { Module } from "@nestjs/common";
import { IntrospectAndCompose, ServiceEndpointDefinition } from "@apollo/gateway";
import { apolloServerOptions, AuthenticatedDataSource } from "@shaastra/utils";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloGatewayDriverConfig>( {
	driver: ApolloGatewayDriver,
	imports: [ ConsulModule, ConfigModule ],
	inject: [ ConsulService, ConfigService ],
	async useFactory( consulService: ConsulService, configService: ConfigService ) {
		const id = configService.getOrThrow<string>( "app.id" );
		const registeredServices = await consulService.getRegisteredServices( id );

		const supergraphSdl = new IntrospectAndCompose( {
			subgraphHealthCheck: true,
			pollIntervalInMs: 2000,
			subgraphs: registeredServices.map( service => (
				{
					name: service.ID,
					url: `http://${ service.Address }:${ service.Port }/api/graphql`
				}
			) )
		} );

		const buildService = ( { url }: ServiceEndpointDefinition ) => new AuthenticatedDataSource( { url } );

		return { server: { ...apolloServerOptions( "gateway" ) }, gateway: { supergraphSdl, buildService } };
	}
} );

const imports = [ ConfigModule, ConsulModule, HealthModule, GraphQLModule ];
const providers = [ CookiePlugin ];

@Module( { imports, providers } )
export class AppModule {}