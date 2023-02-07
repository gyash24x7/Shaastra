import type { CommandBus } from "@nestjs/cqrs";
import type { Token, User } from "@prisma/client/identity/index.js";
import dayjs from "dayjs";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { CreateTokenCommand } from "../../src/commands/create.token.command.js";
import { UserCreatedEventHandler } from "../../src/events/user.created.event.js";

describe( "User Created Event Handler", () => {
	const mockCommandBus = mockDeep<CommandBus>();

	const mockToken: Token = {
		id: "mock_token_id",
		hash: "mock_token_hash",
		expiry: dayjs().add( 2, "days" ).toDate(),
		userId: "1244",
		createdAt: dayjs().toDate()
	};

	it( "should execute create token command when user created event is received", async () => {
		const userCreatedEventHandler = new UserCreatedEventHandler( mockCommandBus );
		mockCommandBus.execute.calledWith( expect.any( CreateTokenCommand ) ).mockResolvedValue( mockToken );

		await userCreatedEventHandler.handle( { data: mockDeep<User>() } );

		expect( mockCommandBus.execute ).toHaveBeenCalledWith( expect.any( CreateTokenCommand ) );
	} );
} );