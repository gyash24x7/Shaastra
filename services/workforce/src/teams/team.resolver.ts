import { Args, Mutation, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { TeamQuery } from "./queries/team.query";
import type { Team } from "@prisma/client/workforce";
import type { CreateTeamInput } from "./commands/create.team.command";
import { CreateTeamCommand } from "./commands/create.team.command";

@Resolver( "Team" )
export class TeamResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Mutation()
	async createTeam( @Args( "data" ) data: CreateTeamInput ): Promise<string> {
		return this.commandBus.execute( new CreateTeamCommand( data ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Team | null> {
		return this.queryBus.execute( new TeamQuery( id ) );
	}
}