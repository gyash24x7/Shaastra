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
		host: process.env[ "CONSUL_HOST" ] || "localhost",
		port: process.env[ "CONSUL_PORT" ] || "8500"
	}
} ) );

@Module( {
	imports: [
		ConfigModule.forRoot( { load: [ appConfig ] } ),
		ConsulModule,
		HealthModule,
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
