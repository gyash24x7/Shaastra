import { ClientsModule, RedisOptions, Transport } from "@nestjs/microservices";
import { AppConfig, CONFIG_DATA } from "../config";
import { REDIS_CLIENT } from "./redis.decorator";

export function redisClientFactory( { redis: { host, port } }: AppConfig ): RedisOptions {
	return { transport: Transport.REDIS, options: { host, port } };
}

export const RedisClientModule = ClientsModule.registerAsync( [
	{ name: REDIS_CLIENT, inject: [ CONFIG_DATA ], useFactory: redisClientFactory }
] );