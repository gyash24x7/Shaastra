import { GraphQLResolverParams, Query, Resolver } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { QueryBus } from "@nestjs/cqrs";
import type { Channel, Message } from "../../prisma/generated";
import { MessagesQuery } from "../queries";

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
