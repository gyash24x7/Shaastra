import type { GraphQLDataSourceProcessOptions } from "@apollo/gateway";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { ServiceDataSource } from "../../src/graphql/service.datasource.js";
import type { ServiceContext } from "../../src/index.js";

describe( "Service Data Source", () => {
	const mockOptions = mockDeep<GraphQLDataSourceProcessOptions<ServiceContext>>();

	it( "should set headers if id cookie is present", () => {
		mockOptions.context.req.cookies[ "identity" ] = "mockIdCookie";

		const datasource = new ServiceDataSource();
		datasource.willSendRequest( mockOptions );

		expect( mockOptions.request.http!.headers.set ).toHaveBeenCalledWith( "Authorization", "Bearer mockIdCookie" );
	} );

	it( "should not set headers if id cookie is not present", () => {
		mockOptions.context.req.cookies[ "identity" ] = undefined;

		const datasource = new ServiceDataSource();
		datasource.willSendRequest( mockOptions );

		expect( mockOptions.request.http!.headers.set ).toHaveBeenCalledTimes( 0 );
	} );

	afterEach( () => {
		mockReset( mockOptions );
	} );
} );