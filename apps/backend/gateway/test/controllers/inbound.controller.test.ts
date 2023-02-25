import type { CommandBus } from "@nestjs/cqrs";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { CreateUserCommand } from "../../src/commands";
import { InboundController, MemberCreatedInboundData } from "../../src/controllers";

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