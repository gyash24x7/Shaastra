import type { PrismaService } from "@app/framework/prisma";
import { Channel, ChannelType, Message, PrismaClient } from "@prisma/client/connect";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { MessagesQuery, MessagesQueryHandler } from "../../src/queries";

describe( "Messages Query Handler", () => {

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

	const mockMessage: Message = {
		createdById: "mock-user-id",
		id: "some-mock-id",
		createdOn: new Date(),
		channelId: "mock-channel-id",
		content: "Message Content"
	};

	const mockChannelWithMessages = { ...mockChannel, messages: [ mockMessage ] };

	it( "should find messages by message id and return them", async () => {
		mockPrismaService.client.channel.findUniqueOrThrow.mockResolvedValue( mockChannelWithMessages );

		const handler = new MessagesQueryHandler( mockPrismaService );
		const messages = await handler.execute( new MessagesQuery( mockChannel.id ) );

		expect( messages ).toEqual( expect.arrayContaining( [ mockMessage ] ) );
		expect( mockPrismaService.client.channel.findUniqueOrThrow ).toHaveBeenCalledWith( {
			where: { id: mockChannel.id },
			include: { messages: true }
		} );
	} );
} );