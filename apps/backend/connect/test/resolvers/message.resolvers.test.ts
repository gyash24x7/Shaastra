import type { QueryBus } from "@nestjs/cqrs";
import { Channel, ChannelType, Message } from "@prisma/client/connect/index.js";
import type { GraphQLResolverParams } from "@shaastra/framework";
import { describe, it, afterEach, expect } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { MessageQuery, ChannelQuery } from "../../src/queries/index.js";
import { MessageResolvers } from "../../src/resolvers/index.js";

describe( "Message Resolvers", () => {

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

	it( "should resolve reference to message when reference resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockMessage.id;
		mockQueryBus.execute.calledWith( expect.any( MessageQuery ) ).mockResolvedValue( mockMessage );

		const messageResolver = new MessageResolvers( mockQueryBus );
		const message = await messageResolver.__resolveReference( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MessageQuery( mockMessage.id ) );
		expect( message ).toEqual( mockMessage );
	} );

	it( "should return channels in the message when channels field resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent[ "channelId" ] = mockMessage.channelId;
		mockQueryBus.execute.calledWith( expect.any( ChannelQuery ) ).mockResolvedValue( [ mockChannel ] );

		const messageResolver = new MessageResolvers( mockQueryBus );
		const channels = await messageResolver.channel( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new ChannelQuery( mockMessage.channelId ) );
		expect( channels ).toEqual( [ mockChannel ] );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );