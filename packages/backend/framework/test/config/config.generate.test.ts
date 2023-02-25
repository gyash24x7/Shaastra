import process from "node:process";
import { describe, expect, it } from "vitest";
import { generateConfig } from "../../src/config";

describe( "GenerateConfig", () => {

	it( "should return app config using default values when env not present", () => {
		process.env = {
			TEST_DB_URL: "postgresql://localhost:5432/test-db",
			TEST_PORT: undefined,
			APP_HOST: undefined,
			AUTH_AUDIENCE: "audience.test.app",
			AUTH_DOMAIN: "domain.test.app",
			REDIS_HOST: "redishost",
			REDIS_PORT: "1234"
		};

		const appConfig = generateConfig( "test" );

		expect( appConfig ).toEqual( {
			appInfo: {
				id: "test",
				name: "Shaastra Test",
				pkg: "@app/test",
				port: 8000,
				url: "http://localhost:8000",
				address: "localhost",
				isGateway: false
			},
			db: {
				url: "postgresql://localhost:5432/test-db"
			},
			auth: {
				audience: "audience.test.app",
				domain: "domain.test.app",
				privateKeyPath: "assets/keys/.private.key",
				publicKeyPath: "assets/keys/.public.key.pem"
			},
			redis: {
				host: "redishost",
				port: 1234
			},
			graphql: {
				schemaPath: "assets/schema.graphql"
			}
		} );
	} );

	it( "should return app config using env values", () => {
		process.env = {
			GATEWAY_DB_URL: "postgresql://localhost:5432/test-db",
			GATEWAY_PORT: "12345",
			APP_HOST: "127.0.0.1",
			AUTH_AUDIENCE: "audience.test.app",
			AUTH_DOMAIN: "domain.test.app",
			REDIS_HOST: "redishost",
			REDIS_PORT: "1234"
		};

		const appConfig = generateConfig( "gateway" );

		expect( appConfig ).toEqual( {
			appInfo: {
				id: "gateway",
				name: "Shaastra Gateway",
				pkg: "@app/gateway",
				port: 12345,
				url: "http://127.0.0.1:12345",
				address: "127.0.0.1",
				isGateway: true
			},
			db: {
				url: "postgresql://localhost:5432/test-db"
			},
			auth: {
				audience: "audience.test.app",
				domain: "domain.test.app",
				privateKeyPath: "assets/keys/.private.key",
				publicKeyPath: "assets/keys/.public.key.pem"
			},
			redis: {
				host: "redishost",
				port: 1234
			},
			graphql: {
				schemaPath: "assets/schema.graphql"
			}
		} );

	} );
} );