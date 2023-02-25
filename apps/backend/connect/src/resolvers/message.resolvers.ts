import { FieldResolver, GraphQLResolverParams, Resolver, ResolveReference } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { QueryBus } from "@nestjs/cqrs";
import type { Channel, Message } from "../../prisma/generated";
import { ChannelQuery, MessageQuery } from "../queries";

@Resolver( "Message" )
export class MessageResolvers {
	private readonly logger = LoggerFactory.getLogger( MessageResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Message> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Message Id: %s", id );
		return this.queryBus.execute( new MessageQuery( id! ) );
	}

	@FieldResolver()
	channel( { parent: { id, channelId } }: GraphQLResolverParams ): Promise<Array<Channel>> {
		this.logger.debug( ">> channels()" );
		this.logger.debug( "Message Id: %s", id );
		return this.queryBus.execute( new ChannelQuery( channelId! ) );
	}
}