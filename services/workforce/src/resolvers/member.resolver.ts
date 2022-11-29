import { Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import { MemberQuery } from "../queries/member.query";
import type { Member, Team } from "../prisma";
import { MemberPosition } from "../prisma";
import { CreateMemberCommand, CreateMemberInput } from "../commands/create.member.command";
import { EnableMemberCommand, EnableMemberInput } from "../commands/enable.member.command";
import { UseGuards } from "@nestjs/common";
import { AuthGuard, AuthInfo, PositionGuard, Positions, UserAuthInfo } from "@shaastra/auth";
import { TeamsQuery } from "../queries/teams.query";

@Resolver( "Member" )
export class MemberResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Mutation( "createMember" )
	async createMember( @Args( "data" ) data: CreateMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new CreateMemberCommand( data ) );
	}

	@UseGuards( AuthGuard )
	@Query( "me" )
	async me( @AuthInfo() authInfo: UserAuthInfo ): Promise<Member> {
		return this.queryBus.execute( new MemberQuery( authInfo.id ) );
	}

	@Positions( MemberPosition.CORE )
	@UseGuards( AuthGuard, PositionGuard )
	@Mutation( "enableMember" )
	async enableMember( @Args( "data" ) data: EnableMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new EnableMemberCommand( data ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Member | null> {
		return this.queryBus.execute( new MemberQuery( id ) );
	}

	@ResolveField( "teams" )
	async teams( @Parent() parent: Member ): Promise<Team[]> {
		return this.queryBus.execute( new TeamsQuery( parent.id ) );
	}
}