import { TokenService, UserEventsListener } from "@api/domain";
import type { Token, User } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "User Events Listener", () => {

	const mockTokenService = mockDeep<TokenService>();
	const mockToken = mockDeep<Token>();
	const mockUser = mockDeep<User>();

	it( "should create verification token and send verification mail when user created", async () => {
		mockUser.id = "some_id";
		mockTokenService.createToken.mockResolvedValue( mockToken );
		const userEventListener = new UserEventsListener( mockTokenService );
		await userEventListener.handleUserCreatedEvent( mockUser );

		expect( mockTokenService.createToken ).toHaveBeenCalledWith( "some_id" );
	} );
} );