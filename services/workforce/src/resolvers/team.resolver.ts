import { Args, Mutation, Parent, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import { TeamQuery } from "../queries/team.query.js";
import type { Member, Team } from "../prisma/index.js";
import { Department, MemberPosition } from "../prisma/index.js";
import { CreateTeamCommand, CreateTeamInput } from "../commands/create.team.command.js";
import { UseGuards } from "@nestjs/common";
import type { UserAuthInfo } from "@shaastra/auth";
import { AuthGuard, AuthInfo, PositionGuard, Positions } from "@shaastra/auth";
import { MembersQuery } from "../queries/members.query.js";

@Resolver( "Team" )
export class TeamResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Positions( MemberPosition.CORE )
	@UseGuards( AuthGuard, PositionGuard )
	@Mutation()
	async createTeam(
		@Args( "data" ) data: CreateTeamInput,
		@AuthInfo() { department, id }: UserAuthInfo
	): Promise<string> {
		return this.commandBus.execute( new CreateTeamCommand( {
			...data,
			department: department as Department,
			createdBy: id
		} ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Team | null> {
		return this.queryBus.execute( new TeamQuery( id ) );
	}

	@ResolveField()
	async members( @Parent() { id }: Team ): Promise<Member[]> {
		return this.queryBus.execute( new MembersQuery( id ) );
	}
}