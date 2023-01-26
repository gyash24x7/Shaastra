import { QueryBus } from "@nestjs/cqrs";
import type { Message, Channel } from "@prisma/client/connect/index.js";
import {
	FieldResolver,
	type GraphQLResolverParams,
	LoggerFactory,
	Resolver,
	ResolveReference
} from "@shaastra/framework";
import { ChannelQuery } from "../queries/channel.query.js";
import { MessagesQuery } from "../queries/messages.query.js";

@Resolver()
export class ChannelResolvers {
	private readonly logger = LoggerFactory.getLogger( ChannelResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference( "Channel" )
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Channel> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Channel Id: %s", id );
		return this.queryBus.execute( new ChannelQuery( id! ) );
	}

	@FieldResolver( "Channel" )
	messages( { parent: { id } }: GraphQLResolverParams ): Promise<Array<Message>> {
		this.logger.debug( ">> messages()" );
		this.logger.debug( "Channel Id: %s", id );
		return this.queryBus.execute( new MessagesQuery( id! ) );
	}
}