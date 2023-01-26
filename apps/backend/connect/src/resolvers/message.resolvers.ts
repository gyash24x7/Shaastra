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
import { MessageQuery } from "../queries/message.query.js";

@Resolver()
export class MessageResolvers {
	private readonly logger = LoggerFactory.getLogger( MessageResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference( "Message" )
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Message> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Message Id: %s", id );
		return this.queryBus.execute( new MessageQuery( id! ) );
	}

	@FieldResolver( "Message" )
	channel( { parent: { id, channelId } }: GraphQLResolverParams ): Promise<Array<Channel>> {
		this.logger.debug( ">> channels()" );
		this.logger.debug( "Message Id: %s", id );
		return this.queryBus.execute( new ChannelQuery( channelId! ) );
	}
}