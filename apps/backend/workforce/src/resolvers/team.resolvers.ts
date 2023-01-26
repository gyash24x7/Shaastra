import { QueryBus } from "@nestjs/cqrs";
import type { Member, Team } from "@prisma/client/workforce/index.js";
import {
	FieldResolver,
	type GraphQLResolverParams,
	LoggerFactory,
	Resolver,
	ResolveReference
} from "@shaastra/framework";
import { TeamQuery } from "../queries/team.query.js";
import { TeamsQuery } from "../queries/teams.query.js";

@Resolver()
export class TeamResolvers {
	private readonly logger = LoggerFactory.getLogger( TeamResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference( "Team" )
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Team> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Team Id: %s", id );
		return this.queryBus.execute( new TeamQuery( id! ) );
	}

	@FieldResolver( "Team" )
	members( { parent: { id } }: GraphQLResolverParams ): Promise<Array<Member>> {
		this.logger.debug( ">> members()" );
		this.logger.debug( "Team Id: %s", id );
		return this.queryBus.execute( new TeamsQuery( id! ) );
	}
}