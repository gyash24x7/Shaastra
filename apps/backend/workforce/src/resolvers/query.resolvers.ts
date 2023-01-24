import { QueryBus } from "@nestjs/cqrs";
import type { Member } from "@prisma/client/workforce/index.js";
import { type GraphQLResolverParams, LoggerFactory, Query, Resolver } from "@shaastra/framework";
import { MemberQuery } from "../queries/member.query.js";

@Resolver( "Query" )
export class QueryResolvers {
	private readonly logger = LoggerFactory.getLogger( QueryResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@Query()
	me( { context: { authInfo } }: GraphQLResolverParams ): Promise<Member> {
		this.logger.debug( ">> me()" );
		this.logger.debug( "AuthInfo: %o", authInfo );
		return this.queryBus.execute( new MemberQuery( authInfo!.id ) );
	};

}
