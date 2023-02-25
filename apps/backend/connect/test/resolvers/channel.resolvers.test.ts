import type { GraphQLResolverParams } from "@app/framework/graphql";
import type { QueryBus } from "@nestjs/cqrs";
import { Channel, ChannelType, Message } from "@prisma/client/connect";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { ChannelQuery, MessagesQuery } from "../../src/queries";
import { ChannelResolvers } from "../../src/resolvers";

describe( "Channel Resolvers", () => {

	const mockQueryBus = mockDeep<QueryBus>();
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

	it( "should resolve reference to channel when reference resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockChannel.id;
		mockQueryBus.execute.calledWith( expect.any( ChannelQuery ) ).mockResolvedValue( mockChannel );

		const channelResolver = new ChannelResolvers( mockQueryBus );
		const channel = await channelResolver.__resolveReference( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new ChannelQuery( mockChannel.id ) );
		expect( channel ).toEqual( mockChannel );
	} );

	it( "should return messages for the channel when messages field resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockChannel.id;
		mockQueryBus.execute.calledWith( expect.any( MessagesQuery ) ).mockResolvedValue( [ mockMessage ] );

		const channelResolver = new ChannelResolvers( mockQueryBus );
		const messages = await channelResolver.messages( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MessagesQuery( mockChannel.id ) );
		expect( messages ).toEqual( [ mockMessage ] );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );