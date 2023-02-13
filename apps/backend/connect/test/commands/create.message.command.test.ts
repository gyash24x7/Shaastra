import type { EventBus } from "@nestjs/cqrs";
import type { PrismaClient, Message } from "@prisma/client/connect/index.js";
import type { PrismaService, UserAuthInfo } from "@shaastra/framework";
import { describe, it, expect, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import {
	type CreateMessageInput,
	CreateMessageCommandHandler,
	CreateMessageCommand
} from "../../src/commands/index.js";
import { MessageCreatedEvent } from "../../src/events/index.js";

describe( "Create Message Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockEventBus = mockDeep<EventBus>();

	const mockAuthInfo: UserAuthInfo = {
		department: "WEBOPS",
		id: "mock-user-id",
		position: "COORD"
	};

	const mockCreateMessageInput: CreateMessageInput = { channelId: "mock-channel-id", content: "Message Content" };

	const mockMessage: Message = {
		createdById: "mock-user-id",
		id: "some-mock-id",
		createdOn: new Date(),
		...mockCreateMessageInput
	};

	it( "should create new message and publish message created event", async () => {
		mockPrismaService.client.message.create.mockResolvedValue( mockMessage );

		const handler = new CreateMessageCommandHandler( mockPrismaService, mockEventBus );
		const message = await handler.execute( new CreateMessageCommand( mockCreateMessageInput, mockAuthInfo ) );

		expect( mockPrismaService.client.message.create ).toHaveBeenCalledWith( {
			data: { ...mockCreateMessageInput, createdById: mockAuthInfo.id }
		} );

		expect( mockEventBus.publish ).toHaveBeenCalledWith( new MessageCreatedEvent( mockMessage ) );
		expect( message ).toEqual( mockMessage );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventBus );
	} );
} );