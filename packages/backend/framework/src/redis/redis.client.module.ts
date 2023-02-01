import { ConfigService, ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport, RedisOptions } from "@nestjs/microservices";
import { REDIS_CLIENT } from "./redis.decorator.js";

export function redisClientFactory( configService: ConfigService ): RedisOptions {
	return {
		transport: Transport.REDIS,
		options: {
			host: configService.getOrThrow<string>( "app.redis.host" ),
			port: configService.getOrThrow<number>( "app.redis.port" )
		}
	};
}

export const RedisClientModule = ClientsModule.registerAsync( [
	{ name: REDIS_CLIENT, inject: [ ConfigService ], useFactory: redisClientFactory, imports: [ ConfigModule ] }
] );