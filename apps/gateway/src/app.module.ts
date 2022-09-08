import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";
import { MercuriusGatewayDriver, MercuriusGatewayDriverConfig } from "@nestjs/mercurius";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import type { FastifyRequest } from "fastify";
import type { AppConfig } from "@shaastra/utils";

const appConfig = registerAs<AppConfig>( "app", () => ( {
	id: "gateway",
	name: "Shaastra Gateway",
	pkg: "@shaastra/gateway",
	port: 9000,
	address: "localhost",
	url: "http://localhost:9000",
	consul: {
		host: process.env[ "CONSUL_URL" ] || "localhost",
		port: process.env[ "CONSUL_PORT" ] || "8500"
	}
} ) );

@Module( {
	imports: [
		ConfigModule.forRoot( {
			load: [ appConfig ],
			isGlobal: true
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
			isGlobal: false,
			imports: [ ConfigModule ],
			inject: [ ConfigService ],
			useFactory: ( configService: ConfigService ) => ( {
				baseUrl: configService.get<string>( "app.url" )!
			} )
		} ),
		GraphQLModule.forRootAsync<MercuriusGatewayDriverConfig>( {
			driver: MercuriusGatewayDriver,
			imports: [ ConsulModule, ConfigModule ],
			inject: [ ConsulService, ConfigService ],
			useFactory: async ( consulService: ConsulService, configService: ConfigService ) => {
				const id = configService.get<string>( "app.id" )!;
				const registeredServices = await consulService.getRegisteredServices( id );

				return {
					federationMetadata: true,
					graphiql: true,
					context: ( request: FastifyRequest ) => ( { request } ),
					gateway: {
						services: registeredServices.map( service => ( {
							name: service.ID,
							url: `http://${ service.Address }:${ service.Port }/graphql`,
							rewriteHeaders: ( { authorization } ) => ( { authorization } )
						} ) )
					}
				};
			}
		} )
	]
} )
export class AppModule {}
