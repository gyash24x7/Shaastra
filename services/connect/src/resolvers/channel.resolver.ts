import { Args, Mutation, Resolver, ResolveReference } from "@nestjs/graphql";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import type { Channel } from "../prisma/index.js";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ChannelQuery } from "../queries/channel.query.js";
import { CreateChannelCommand, CreateChannelInput } from "../commands/create.channel.command.js";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";


@Resolver( "Channel" )
export class ChannelResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@UseGuards( AuthGuard )
	@Mutation()
	async createChannel(
		@Args( "data" ) data: CreateChannelInput,
		@AuthInfo() authInfo: UserAuthInfo
	): Promise<string> {
		return this.commandBus.execute( new CreateChannelCommand( data, authInfo ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Channel | null> {
		return this.queryBus.execute( new ChannelQuery( id ) );
	}
}