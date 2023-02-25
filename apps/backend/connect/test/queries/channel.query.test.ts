import type { PrismaService } from "@app/framework/prisma";
import { Channel, ChannelType, PrismaClient } from "@prisma/client/connect";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { ChannelQuery, ChannelQueryHandler } from "../../src/queries";

describe( "Channel Query Handler", () => {

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

	it( "should find channel by id and return it", async () => {
		mockPrismaService.client.channel.findUniqueOrThrow.mockResolvedValue( mockChannel );

		const handler = new ChannelQueryHandler( mockPrismaService );
		const channel = await handler.execute( new ChannelQuery( mockChannel.id ) );

		expect( channel ).toEqual( mockChannel );
		expect( mockPrismaService.client.channel.findUniqueOrThrow ).toHaveBeenCalledWith( {
			where: { id: mockChannel.id }
		} );
	} );
} );