import type { PrismaService } from "@api/common";
import { TokenService } from "@api/domain";
import type { Token } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Token Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockToken = mockDeep<Token>();

	it( "should create new token when create token is called", async () => {
		mockPrismaService.token.create.mockResolvedValue( mockToken );
		const tokenService = new TokenService( mockPrismaService );
		const token = await tokenService.createToken( "some_id" );

		expect( token ).toBe( mockToken );
		expect( mockPrismaService.token.create ).toHaveBeenCalledWith(
			expect.objectContaining( {
				data: expect.objectContaining( { userId: "some_id" } )
			} )
		);
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
	} );
} );