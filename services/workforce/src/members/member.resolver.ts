import { Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { MemberQuery } from "./queries/member.query";
import type { Member, Team } from "@prisma/client/workforce";
import { MemberPosition } from "@prisma/client/workforce";
import type { CreateMemberInput } from "./commands/create.member.command";
import { CreateMemberCommand } from "./commands/create.member.command";
import type { EnableMemberInput } from "./commands/enable.member.command";
import { EnableMemberCommand } from "./commands/enable.member.command";
import { UseGuards } from "@nestjs/common";
import { AuthGuard, AuthInfo, PositionGuard, Positions, UserAuthInfo } from "@shaastra/auth";
import { TeamQuery } from "../teams/queries/team.query";

@Resolver( "Member" )
export class MemberResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Mutation()
	async createMember( @Args( "data" ) data: CreateMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new CreateMemberCommand( data ) );
	}

	@UseGuards( AuthGuard )
	@Query()
	async me( @AuthInfo() authInfo: UserAuthInfo ): Promise<Member> {
		return this.queryBus.execute( new MemberQuery( authInfo.id ) );
	}

	@Positions( MemberPosition.CORE )
	@UseGuards( AuthGuard, PositionGuard )
	@Mutation()
	async enableMember( @Args( "data" ) data: EnableMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new EnableMemberCommand( data ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Member | null> {
		return this.queryBus.execute( new MemberQuery( id ) );
	}

	@ResolveField()
	async teams( @Parent() parent: Member ): Promise<Team[]> {
		return this.queryBus.execute( new TeamQuery( parent.id, true ) );
	}
}