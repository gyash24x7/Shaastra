import type { QueryBus } from "@nestjs/cqrs";
import type { Message } from "@prisma/client/connect/index.js";
import type { UserAuthInfo, GraphQLResolverParams } from "@shaastra/framework";
import { describe, it, expect, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { MessagesQuery } from "../../src/queries/index.js";
import { QueryResolvers } from "../../src/resolvers/index.js";

describe( "Query Resolvers", () => {

	const mockQueryBus = mockDeep<QueryBus>();

	const mockAuthInfo: UserAuthInfo = {
		department: "WEBOPS",
		id: "mock-user-id",
		position: "COORD"
	};

	const mockMessage: Message = {
		createdById: mockAuthInfo.id,
		id: "some-mock-id",
		createdOn: new Date(),
		channelId: "mock-channel-id",
		content: "Message Content"
	};

	it( "should return all messages for a channel when messages is called", async () => {
		mockQueryBus.execute.calledWith( expect.any( MessagesQuery ) ).mockResolvedValue( [ mockMessage ] );
		const mockGqlParams = mockDeep<GraphQLResolverParams<{ channelId: string }>>();
		mockGqlParams.args.data = { channelId: mockMessage.channelId };

		const resolver = new QueryResolvers( mockQueryBus );
		const messages = await resolver.messages( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MessagesQuery( mockMessage.channelId ) );
		expect( messages ).toEqual( [ mockMessage ] );
	} );

	it( "should return channels that user is part of when channels is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams<{ id: string }>>();
		mockGqlParams.args.data = { id: mockMessage.channelId };

		const resolver = new QueryResolvers( mockQueryBus );
		const channels = await resolver.channels( mockGqlParams );

		expect( channels ).toEqual( [] );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );