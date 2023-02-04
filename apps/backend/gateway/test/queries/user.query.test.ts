import type { User, PrismaClient } from "@prisma/client/identity/index.js";
import type { PrismaService } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import { mockDeep } from "vitest-mock-extended";
import { UserQueryHandler } from "../../src/queries/user.query.js";

describe( "User Query Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockUser: User = {
		id: "1244",
		email: "abcd@test.com",
		username: "user_name",
		password: bcrypt.hashSync( "some_password", 10 ),
		name: "abcd efgh",
		roles: [],
		verified: true
	};

	it( "should find user by id and return it", async () => {
		mockPrismaService.client.user.findUnique.mockResolvedValue( mockUser );
		const userQueryHandler = new UserQueryHandler( mockPrismaService );

		const user = await userQueryHandler.execute( { userId: "1244" } );

		expect( user ).toEqual( mockUser );
		expect( mockPrismaService.client.user.findUnique ).toHaveBeenCalledWith( { where: { id: "1244" } } );
	} );
} );