import type { CommandBus } from "@nestjs/cqrs";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { CreateUserCommand } from "../../src/commands/create.user.command.js";
import { InboundController, MemberCreatedInboundData } from "../../src/controllers/inbound.controller.js";

describe( "Inbound Controller", () => {
	const mockCommandBus = mockDeep<CommandBus>();

	it( "should execute create user command when member created event is received", async () => {
		const inboundController = new InboundController( mockCommandBus );
		mockCommandBus.execute.calledWith( expect.any( CreateUserCommand ) ).mockResolvedValue( "mock_user_id" );

		const userId = await inboundController.handleMemberCreatedEvent( mockDeep<MemberCreatedInboundData>() );

		expect( userId ).toBe( "mock_user_id" );
		expect( mockCommandBus.execute ).toHaveBeenCalledWith( expect.any( CreateUserCommand ) );
	} );
} );