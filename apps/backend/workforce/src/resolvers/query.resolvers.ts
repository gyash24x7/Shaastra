import { isAuthenticated } from "@app/framework/auth";
import { GraphQLResolverParams, GraphQLShield, Query, Resolver } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { QueryBus } from "@nestjs/cqrs";
import type { Member } from "../../prisma/generated";
import { MemberQuery } from "../queries";

@Resolver( "Query" )
export class QueryResolvers {
	private readonly logger = LoggerFactory.getLogger( QueryResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@Query()
	@GraphQLShield( isAuthenticated )
	me( { context: { authInfo } }: GraphQLResolverParams ): Promise<Member> {
		this.logger.debug( ">> me()" );
		this.logger.debug( "AuthInfo: %o", authInfo );
		return this.queryBus.execute( new MemberQuery( authInfo!.id ) );
	};

}
