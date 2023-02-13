import type { ClientRedis } from "@nestjs/microservices";
import type { Message } from "@prisma/client/connect/index.js";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { OutboundEvents } from "../../src/constants/outbound.events.js";
import { MessageCreatedEventHandler, MessageCreatedEvent } from "../../src/events/index.js";

describe( "Message Created Event Handler", () => {

	const mockRedisClient = mockDeep<ClientRedis>();

	const mockMessage: Message = {
		createdById: "mock-user-id",
		id: "some-mock-id",
		createdOn: new Date(),
		channelId: "mock-channel-id",
		content: "Message Content"
	};

	it( "should publish outbound event if core found for that department", async () => {
		const handler = new MessageCreatedEventHandler( mockRedisClient );
		await handler.handle( new MessageCreatedEvent( mockMessage ) );

		expect( mockRedisClient.emit ).toHaveBeenCalledWith( OutboundEvents.MESSAGE_CREATED, mockMessage );
	} );
} );