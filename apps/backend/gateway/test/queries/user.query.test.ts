import type { PrismaService } from "@app/framework/prisma";
import type { PrismaClient, User } from "@prisma/client/gateway";
import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { UserQueryHandler } from "../../src/queries";

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