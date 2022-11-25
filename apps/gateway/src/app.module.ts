import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./app.config";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { MercuriusGatewayDriver, MercuriusGatewayDriverConfig } from "@nestjs/mercurius";
import { ConsulModule, ConsulService } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { Module } from "@nestjs/common";
import { buildService, mercuriusOptions } from "@shaastra/utils";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRootAsync<MercuriusGatewayDriverConfig>( {
	driver: MercuriusGatewayDriver,
	imports: [ ConsulModule, ConfigModule ],
	inject: [ ConsulService, ConfigService ],
	async useFactory( consulService: ConsulService, configService: ConfigService ) {
		const id = configService.getOrThrow<string>( "app.id" );
		const registeredServices = await consulService.getRegisteredServices( id );
		const services = await Promise.all( registeredServices.map( buildService ) );
		return { ...mercuriusOptions, gateway: { services } };
	}
} );

@Module( { imports: [ ConfigModule, ConsulModule, HealthModule, GraphQLModule ] } )
export class AppModule {}