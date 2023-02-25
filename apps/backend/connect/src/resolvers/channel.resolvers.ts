import { FieldResolver, GraphQLResolverParams, Resolver, ResolveReference } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { QueryBus } from "@nestjs/cqrs";
import type { Channel, Message } from "../../prisma/generated";
import { ChannelQuery, MessagesQuery } from "../queries";

@Resolver( "Channel" )
export class ChannelResolvers {
	private readonly logger = LoggerFactory.getLogger( ChannelResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Channel> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Channel Id: %s", id );
		return this.queryBus.execute( new ChannelQuery( id! ) );
	}

	@FieldResolver()
	messages( { parent: { id } }: GraphQLResolverParams ): Promise<Array<Message>> {
		this.logger.debug( ">> messages()" );
		this.logger.debug( "Channel Id: %s", id );
		return this.queryBus.execute( new MessagesQuery( id! ) );
	}
}