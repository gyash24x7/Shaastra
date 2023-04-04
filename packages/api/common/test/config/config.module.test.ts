import { Injectable, ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import process from "node:process";
import { describe, expect, it } from "vitest";
import type { AppConfig } from "../../src";
import { Config, ConfigModule } from "../../src";

@Injectable()
class ExampleService {

	constructor( @Config() private readonly config: AppConfig ) {}

	get appConfig() {
		return this.config;
	}
}

describe( "ConfigModule", () => {

	it( "should be able to inject config using decorator", async () => {
		process.env = {
			...process.env,
			DATABASE_URL: "postgresql://localhost:5432/test-db",
			APP_PORT: undefined,
			APP_HOST: undefined,
			AUTH_AUDIENCE: "audience.test.app",
			AUTH_DOMAIN: "domain.test.app"
		};

		const testModuleMetadata: ModuleMetadata = {
			imports: [ ConfigModule.register() ],
			providers: [ ExampleService ]
		};

		const testModule = await Test.createTestingModule( testModuleMetadata ).compile();

		const exampleService = testModule.get( ExampleService );

		expect( exampleService.appConfig ).toEqual( {
			appInfo: {
				id: expect.any( String ),
				name: "Fest Application",
				port: 8000,
				url: "http://localhost:8000",
				address: "localhost"
			},
			db: {
				url: "postgresql://localhost:5432/test-db"
			},
			auth: {
				audience: "audience.test.app",
				domain: "domain.test.app",
				privateKeyPath: "assets/keys/.private.key",
				publicKeyPath: "assets/keys/.public.key.pem"
			}
		} );

	} );
} );