import { Args, Mutation, Resolver, ResolveReference } from "@nestjs/graphql";
import { ChannelModel } from "../models/channel.model";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import type { Channel } from "../prisma";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ChannelQuery } from "../queries/channel.query";
import { CreateChannelCommand, CreateChannelInput } from "../commands/create.channel.command";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";


@Resolver( () => ChannelModel )
export class ChannelResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@UseGuards( AuthGuard )
	@Mutation( () => String )
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