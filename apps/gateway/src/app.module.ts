import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./app.config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { MercuriusGatewayDriver, MercuriusGatewayDriverConfig } from "@nestjs/mercurius";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { Module } from "@nestjs/common";
import { buildService, mercuriusOptions } from "@shaastra/utils";
import type { MercuriusGatewayService } from "mercurius";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRootAsync<MercuriusGatewayDriverConfig>( {
	driver: MercuriusGatewayDriver,
	imports: [ ConsulModule, ConfigModule ],
	inject: [ ConsulService, ConfigService ],
	async useFactory( consulService: ConsulService, configService: ConfigService ) {
		const serviceIds = configService.getOrThrow<string[]>( "app.gateway.services" );
		const registeredServices = await consulService.getAllServices();
		const services: MercuriusGatewayService[] = await Promise.all(
			serviceIds.map( service => buildService( service, registeredServices ) )
		);
		console.log( services );
		return { ...mercuriusOptions(), gateway: { services } };
	}
} );

@Module( { imports: [ ConfigModule, ConsulModule, HealthModule, GraphQLModule ] } )
export class AppModule {}