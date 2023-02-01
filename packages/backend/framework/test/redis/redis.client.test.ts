import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { Transport, ClientProxy, ClientRedis, ClientsModule } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";

import { mockDeep } from "vitest-mock-extended";
import { redisClientFactory, RedisClient, REDIS_CLIENT } from "../../src/index.js";

test( "Redis Client Factory should return correct redis options", () => {
	const mockConfigService = mockDeep<ConfigService>();
	mockConfigService.getOrThrow
		.mockReturnValueOnce( "localhost" )
		.mockReturnValueOnce( 6379 );

	const redisOptions = redisClientFactory( mockConfigService );
	expect( redisOptions ).toEqual( {
		transport: Transport.REDIS,
		options: {
			host: "localhost",
			port: 6379
		}
	} );
} );

@Injectable()
class ExampleService {
	constructor( @RedisClient() private readonly _redisClient: ClientProxy ) {}

	get redisClient() {
		return this._redisClient;
	}
}

test( "RedisClient Decorator should inject redis client", async () => {
	const testModuleMetadata = {
		providers: [ ExampleService ],
		imports: [
			ClientsModule.register( [
				{
					transport: Transport.REDIS,
					options: { host: "localhost", port: 6379 },
					name: REDIS_CLIENT
				}
			] )
		]
	};
	const testModuleFixture = await Test.createTestingModule( testModuleMetadata ).compile();
	await testModuleFixture.init();

	const exampleService = testModuleFixture.get( ExampleService );
	expect( exampleService.redisClient ).toBeInstanceOf( ClientRedis );
} );