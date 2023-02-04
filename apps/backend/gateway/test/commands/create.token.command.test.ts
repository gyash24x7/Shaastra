import type { Token, PrismaClient } from "@prisma/client/identity/index.js";
import type { PrismaService } from "@shaastra/framework";
import { mockDeep } from "vitest-mock-extended";
import { CreateTokenCommandHandler } from "../../src/commands/create.token.command.js";

describe( "Create Token Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	mockPrismaService.client.token.create.mockResolvedValue( mockDeep<Token>() );

	it( "should create new token for the given userId", async () => {
		const createTokenCommandHandler = new CreateTokenCommandHandler( mockPrismaService );
		await createTokenCommandHandler.execute( { data: { userId: "12345" } } );

		expect( mockPrismaService.client.token.create ).toHaveBeenCalledWith( {
			data: {
				userId: "12345",
				hash: expect.any( String ),
				expiry: expect.any( Date )
			}
		} );
	} );

} );