import type { ClientRedis } from "@nestjs/microservices";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import type { Message } from "../../prisma/generated";
import { OutboundEvents } from "../../src/constants";
import { MessageCreatedEvent, MessageCreatedEventHandler } from "../../src/events";

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