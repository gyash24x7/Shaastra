import { QueryBus } from "@nestjs/cqrs";
import type { Message, Channel } from "@prisma/client/connect/index.js";
import { type GraphQLResolverParams, LoggerFactory, Query, Resolver } from "@shaastra/framework";
import { MessagesQuery } from "../queries/messages.query.js";

@Resolver( "Query" )
export class QueryResolvers {
	private readonly logger = LoggerFactory.getLogger( QueryResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@Query()
	messages( { args }: GraphQLResolverParams<{ channelId: string }> ): Promise<Message[]> {
		this.logger.debug( ">> messages()" );
		this.logger.debug( "Data: %o", args.data );
		return this.queryBus.execute( new MessagesQuery( args.data.channelId ) );
	};

	@Query()
	async channels( { args }: GraphQLResolverParams<{ id: string }> ): Promise<Channel[]> {
		this.logger.debug( ">> channel()" );
		this.logger.debug( "Data: %o", args.data );
		return [];
	};
}
