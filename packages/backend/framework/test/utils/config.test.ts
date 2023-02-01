import process from "node:process";

import { generateAppInfo, appConfigFactory } from "../../src/index.js";

test( "Generate AppInfo should generate app info based on provided id", () => {
	const appInfo = generateAppInfo( "test" );

	expect( appInfo ).toEqual( {
		id: "test",
		name: "Shaastra Test",
		pkg: "@shaastra/test",
		port: 8000,
		url: "http://localhost:8000",
		address: "localhost"
	} );
} );

test( "AppConfigFactory should return app config function with correct values", () => {
	process.env = {
		TEST_PORT: "12345",
		APP_HOST: "127.0.0.1",
		AUTH_AUDIENCE: "audience.test.app",
		AUTH_DOMAIN: "domain.test.app",
		REDIS_HOST: "redishost",
		REDIS_PORT: "1234"
	};

	const configFn = appConfigFactory( "test" );
	const appConfig = configFn();

	expect( appConfig ).toEqual( {
		id: "test",
		name: "Shaastra Test",
		pkg: "@shaastra/test",
		port: 12345,
		url: "http://127.0.0.1:12345",
		address: "127.0.0.1",
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