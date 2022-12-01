import { Args, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import type { Message } from "../prisma/index.js";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessageQuery } from "../queries/message.query.js";
import { CreateMessageCommand, CreateMessageInput } from "../commands/create.message.command.js";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";
import { MessagesQuery } from "../queries/messages.query.js";


@Resolver( "Message" )
export class MessageResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@UseGuards( AuthGuard )
	@Mutation()
	async createMessage(
		@Args( "data" ) data: CreateMessageInput,
		@AuthInfo() authInfo: UserAuthInfo
	): Promise<string> {
		return this.commandBus.execute( new CreateMessageCommand( data, authInfo ) );
	}

	@UseGuards( AuthGuard )
	@Query()
	async getMessages( @AuthInfo() authInfo: UserAuthInfo ): Promise<Message[]> {
		return this.queryBus.execute( new MessagesQuery( authInfo.id ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Message | null> {
		return this.queryBus.execute( new MessageQuery( id ) );
	}
}