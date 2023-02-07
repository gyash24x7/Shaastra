import type { Ogma } from "@ogma/logger";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { LoggerService } from "../../src/logger/logger.service.js";

describe( "Logger Service", () => {
	const mockOgma = mockDeep<Ogma>();

	it( "should call log methods on base ogma logger", () => {
		const loggerService = new LoggerService( mockOgma );

		loggerService.log( "Test Log: %o", { key: "value" } );
		expect( mockOgma.info ).toHaveBeenCalled();

		loggerService.debug( "Test Log: %o", { key: "value" } );
		expect( mockOgma.debug ).toHaveBeenCalled();

		loggerService.info( "Test Log: %o", { key: "value" } );
		expect( mockOgma.info ).toHaveBeenCalled();

		loggerService.error( "Test Log: %o", { key: "value" } );
		expect( mockOgma.error ).toHaveBeenCalled();

		loggerService.warn( "Test Log: %o", { key: "value" } );
		expect( mockOgma.warn ).toHaveBeenCalled();

		loggerService.verbose( "Test Log: %o", { key: "value" } );
		expect( mockOgma.verbose ).toHaveBeenCalled();

		loggerService.trace( "Test Log: %o", { key: "value" } );
		expect( mockOgma.verbose ).toHaveBeenCalled();
	} );

	it( "should set context in ogma if scope is provided", () => {
		const loggerService = new LoggerService( mockOgma, "MockScope" );

		loggerService.log( "Some Message" );
		expect( mockOgma.info ).toHaveBeenCalledWith( "Some Message", { context: "MockScope" } );
	} );
} );