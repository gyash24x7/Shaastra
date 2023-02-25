import type { UserAuthInfo } from "@app/framework/auth";
import type { PrismaService } from "@app/framework/prisma";
import type { EventBus } from "@nestjs/cqrs";
import type { Message, PrismaClient } from "@prisma/client/connect";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { CreateMessageCommand, CreateMessageCommandHandler, type CreateMessageInput } from "../../src/commands";
import { MessageCreatedEvent } from "../../src/events";

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