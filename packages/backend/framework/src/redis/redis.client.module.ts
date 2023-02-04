import { ClientsModule, Transport, RedisOptions } from "@nestjs/microservices";
import { CONFIG_DATA } from "../config/index.js";
import type { AppConfig } from "../utils/index.js";
import { REDIS_CLIENT } from "./redis.decorator.js";

export function redisClientFactory( { redis: { host, port } }: AppConfig ): RedisOptions {
	return { transport: Transport.REDIS, options: { host, port } };
}

export const RedisClientModule = ClientsModule.registerAsync( [
	{ name: REDIS_CLIENT, inject: [ CONFIG_DATA ], useFactory: redisClientFactory }
] );