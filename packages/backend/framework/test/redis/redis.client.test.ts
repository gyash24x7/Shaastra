import { Injectable } from "@nestjs/common";
import { Transport, ClientProxy, ClientRedis } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { generateConfig } from "../../src/config/config.generate.js";
import { redisClientFactory, RedisClient, ConfigModule, RedisClientModule } from "../../src/index.js";

test( "Redis Client Factory should return correct redis options", () => {
	process.env = { REDIS_HOST: "localhost", REDIS_PORT: "6379" };
	const mockConfig = generateConfig( "test" );

	const redisOptions = redisClientFactory( mockConfig );
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
		imports: [ ConfigModule.register( "test" ), RedisClientModule ]
	};
	const testModuleFixture = await Test.createTestingModule( testModuleMetadata ).compile();
	await testModuleFixture.init();

	const exampleService = testModuleFixture.get( ExampleService );
	expect( exampleService.redisClient ).toBeInstanceOf( ClientRedis );
} );