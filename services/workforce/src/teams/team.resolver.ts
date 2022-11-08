import { Args, Mutation, Parent, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { TeamQuery } from "./queries/team.query";
import type { Member, Team } from "@prisma/client/workforce";
import { Department, MemberPosition } from "@prisma/client/workforce";
import { CreateTeamCommand, CreateTeamInput } from "./commands/create.team.command";
import { UseGuards } from "@nestjs/common";
import { AuthGuard, AuthInfo, PositionGuard, Positions, UserAuthInfo } from "@shaastra/auth";
import { MembersQuery } from "../members/queries/members.query";
import { TeamModel } from "./team.model";

@Resolver( () => TeamModel )
export class TeamResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Positions( MemberPosition.CORE )
	@UseGuards( AuthGuard, PositionGuard )
	@Mutation( () => String )
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