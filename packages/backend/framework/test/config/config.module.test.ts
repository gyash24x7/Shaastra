import { Injectable, ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import process from "node:process";
import type { AppConfig } from "../../src/index.js";
import { Config, ConfigModule } from "../../src/index.js";

@Injectable()
class ExampleService {

	constructor( @Config() private readonly config: AppConfig ) {}

	get appConfig() {
		return this.config;
	}
}

describe( "ConfigModule", () => {
	process.env = {
		TEST_PORT: undefined,
		APP_HOST: undefined,
		AUTH_AUDIENCE: "audience.test.app",
		AUTH_DOMAIN: "domain.test.app",
		REDIS_HOST: "redishost",
		REDIS_PORT: "1234"
	};

	it( "should be able to inject config using decorator", async () => {
		const testModuleMetadata: ModuleMetadata = {
			imports: [ ConfigModule.register( "test" ) ],
			providers: [ ExampleService ]
		};

		const testModule = await Test.createTestingModule( testModuleMetadata ).compile();

		const exampleService = testModule.get( ExampleService );

		expect( exampleService.appConfig ).toEqual( {
			appInfo: {
				id: "test",
				name: "Shaastra Test",
				pkg: "@shaastra/test",
				port: 8000,
				url: "http://localhost:8000",
				address: "localhost",
				isGateway: false
			},
			auth: {
				audience: "audience.test.app",
				domain: "domain.test.app",
				privateKeyPath: "src/assets/keys/.private.key",
				publicKeyPath: "src/assets/keys/.public.key.pem"
			},
			redis: {
				host: "redishost",
				port: 1234
			},
			graphql: {
				schemaPath: "src/assets/schema.graphql"
			}
		} );

	} );
} );