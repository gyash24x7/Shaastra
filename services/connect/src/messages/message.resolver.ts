import { Resolver, ResolveReference } from "@nestjs/graphql";
import { MessageModel } from "./message.model";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import type { Message } from "@prisma/client/connect";
import { QueryBus } from "@nestjs/cqrs";
import { MessageQuery } from "./queries/message.query";


@Resolver( () => MessageModel )
export class MessageResolver {
	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Message | null> {
		return this.queryBus.execute( new MessageQuery( id ) );
	}
}