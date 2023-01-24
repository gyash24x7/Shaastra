import { ClientsModule, Transport } from "@nestjs/microservices";
import { REDIS_CLIENT } from "./redis.decorator.js";
import { ConfigService } from "@nestjs/config";

export const RedisClientModule = ClientsModule.registerAsync( [
	{
		name: REDIS_CLIENT,
		inject: [ ConfigService ],
		useFactory( configService: ConfigService ) {
			return {
				transport: Transport.REDIS,
				options: {
					host: configService.getOrThrow( "app.redis.host" ),
					port: configService.getOrThrow( "app.redis.port" )
				}
			};
		}
	}
] );