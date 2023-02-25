import { FieldResolver, GraphQLResolverParams, Resolver, ResolveReference } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { QueryBus } from "@nestjs/cqrs";
import type { Member, Team } from "../../prisma/generated";
import { MembersQuery, TeamQuery } from "../queries";

@Resolver( "Team" )
export class TeamResolvers {
	private readonly logger = LoggerFactory.getLogger( TeamResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Team> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Team Id: %s", id );
		return this.queryBus.execute( new TeamQuery( id! ) );
	}

	@FieldResolver()
	members( { parent: { id } }: GraphQLResolverParams ): Promise<Array<Member>> {
		this.logger.debug( ">> members()" );
		this.logger.debug( "Team Id: %s", id );
		return this.queryBus.execute( new MembersQuery( id! ) );
	}
}