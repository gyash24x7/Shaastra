import type { PrismaService } from "@app/framework/prisma";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import type { Message, PrismaClient } from "../../prisma/generated";
import { MessageQuery, MessageQueryHandler } from "../../src/queries";

describe( "Message Query Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockMessage: Message = {
		createdById: "mock-user-id",
		id: "some-mock-id",
		createdOn: new Date(),
		channelId: "mock-channel-id",
		content: "Message Content"
	};

	it( "should find message by id and return it", async () => {
		mockPrismaService.client.message.findUniqueOrThrow.mockResolvedValue( mockMessage );

		const handler = new MessageQueryHandler( mockPrismaService );
		const message = await handler.execute( new MessageQuery( mockMessage.id ) );

		expect( message ).toEqual( mockMessage );
		expect( mockPrismaService.client.message.findUniqueOrThrow ).toHaveBeenCalledWith( {
			where: { id: mockMessage.id }
		} );
	} );
} );