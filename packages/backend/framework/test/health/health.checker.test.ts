import type { Server } from "http";
import { afterAll, describe, expect, it, vi } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import { HealthChecker } from "../../src/health";

vi.mock( "@godaddy/terminus" );

describe( "HealthChecker", function () {

	const mockHttpServer = mock<Server>();

	let healthChecker: HealthChecker;

	it( "should return successful response when health api handler is invoked", async () => {
		healthChecker = new HealthChecker( mockHttpServer );
		const response = await healthChecker.healthApiHandler();
		expect( response.message ).toBe( "OK" );
	} );

	afterAll( () => {
		mockReset( mockHttpServer );
	} );
} );