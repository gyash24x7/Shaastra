import process from "node:process";
import { generateConfig } from "../../src/config/config.generate.js";

describe( "GenerateConfig", () => {

	it( "should return app config using default values when env not present", () => {
		process.env = {
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

	it( "should return app config using env values", () => {
		process.env = {
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
				pkg: "@shaastra/gateway",
				port: 12345,
				url: "http://127.0.0.1:12345",
				address: "127.0.0.1",
				isGateway: true
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