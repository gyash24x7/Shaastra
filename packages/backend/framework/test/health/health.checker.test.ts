import type { Server } from "http";
import { afterAll, describe, expect, it, vi } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import { HealthChecker } from "../../src/health/index.js";
import { createLogger } from "../../src/logger/index.js";

vi.mock( "@godaddy/terminus" );
const logger = createLogger();

describe( "HealthChecker", function () {

	const mockHttpServer = mock<Server>();

	let healthChecker: HealthChecker;

	it( "should return successful response when health api handler is invoked", async () => {
		healthChecker = new HealthChecker( mockHttpServer, logger );
		const response = await healthChecker.healthApiHandler();
		expect( response.message ).toBe( "OK" );
	} );

	afterAll( () => {
		mockReset( mockHttpServer );
	} );
} );