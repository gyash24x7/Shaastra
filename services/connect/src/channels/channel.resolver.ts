import { Resolver, ResolveReference } from "@nestjs/graphql";
import { ChannelModel } from "./channel.model";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import type { Channel } from "@prisma/client/connect";
import { QueryBus } from "@nestjs/cqrs";
import { ChannelQuery } from "./queries/channel.query";


@Resolver( () => ChannelModel )
export class ChannelResolver {
	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Channel | null> {
		return this.queryBus.execute( new ChannelQuery( id ) );
	}
}