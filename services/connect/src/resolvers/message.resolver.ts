import { Args, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import { MessageModel } from "../models/message.model";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import type { Message } from "../prisma";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessageQuery } from "../queries/message.query";
import { CreateMessageCommand, CreateMessageInput } from "../commands/create.message.command";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";
import { MessagesQuery } from "../queries/messages.query";


@Resolver( () => MessageModel )
export class MessageResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@UseGuards( AuthGuard )
	@Mutation( () => String )
	async createMessage(
		@Args( "data" ) data: CreateMessageInput,
		@AuthInfo() authInfo: UserAuthInfo
	): Promise<string> {
		return this.commandBus.execute( new CreateMessageCommand( data, authInfo ) );
	}

	@UseGuards( AuthGuard )
	@Query( () => [ MessageModel ] )
	async getMessages( @AuthInfo() authInfo: UserAuthInfo ): Promise<MessageModel[]> {
		return this.queryBus.execute( new MessagesQuery( authInfo.id ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Message | null> {
		return this.queryBus.execute( new MessageQuery( id ) );
	}
}