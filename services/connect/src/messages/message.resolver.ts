import { Args, Mutation, Resolver, ResolveReference } from "@nestjs/graphql";
import { MessageModel } from "./message.model";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import type { Message } from "@prisma/client/connect";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessageQuery } from "./queries/message.query";
import { CreateMessageCommand, CreateMessageInput } from "./commands/create.message.command";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";


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

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Message | null> {
		return this.queryBus.execute( new MessageQuery( id ) );
	}
}