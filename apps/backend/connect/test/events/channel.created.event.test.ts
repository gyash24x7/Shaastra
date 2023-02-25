import type { PrismaService } from "@app/framework/prisma";
import type { ClientRedis } from "@nestjs/microservices";
import type { Channel, PrismaClient } from "@prisma/client/connect";
import { ChannelType } from "@prisma/client/connect";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { OutboundEvents } from "../../src/constants";
import { ChannelCreatedEvent, ChannelCreatedEventHandler } from "../../src/events";

describe( "Channel Created Event Handler", () => {

	const mockRedisClient = mockDeep<ClientRedis>();
	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();

	const mockChannel: Channel = {
		archived: false,
		createdById: "some-user-id",
		createdOn: new Date(),
		id: "some-channel-id",
		description: "Mock Channel Description",
		name: "Mock Channel",
		type: ChannelType.GROUP
	};

	it( "should publish outbound event if core found for that department", async () => {
		mockPrismaService.client.channel.findFirst.mockResolvedValue( mockChannel );

		const handler = new ChannelCreatedEventHandler( mockRedisClient );
		await handler.handle( new ChannelCreatedEvent( mockChannel ) );

		expect( mockRedisClient.emit ).toHaveBeenCalledWith( OutboundEvents.CHANNEL_CREATED, mockChannel );
	} );
} );