import process from "node:process";
import { describe, expect, it } from "vitest";
import { generateConfig } from "../../src";

describe( "GenerateConfig", () => {

	it( "should return app config using default values when env not present", () => {
		process.env = {
			DATABASE_URL: "postgresql://localhost:5432/test-db",
			APP_PORT: undefined,
			APP_HOST: undefined,
			AUTH_AUDIENCE: "audience.test.app",
			AUTH_DOMAIN: "domain.test.app"
		};

		const appConfig = generateConfig();

		expect( appConfig ).toEqual( {
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

	it( "should return app config using env values", () => {
		process.env = {
			DATABASE_URL: "postgresql://localhost:5432/test-db",
			APP_PORT: "12345",
			APP_HOST: "127.0.0.1",
			AUTH_AUDIENCE: "audience.test.app",
			AUTH_DOMAIN: "domain.test.app"
		};

		const appConfig = generateConfig();

		expect( appConfig ).toEqual( {
			appInfo: {
				id: expect.any( String ),
				name: "Fest Application",
				port: 12345,
				url: "http://127.0.0.1:12345",
				address: "127.0.0.1"
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