import { Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import { MemberQuery } from "../queries/member.query.js";
import type { Member, Team } from "../prisma/index.js";
import { MemberPosition } from "../prisma/index.js";
import { CreateMemberCommand, CreateMemberInput } from "../commands/create.member.command.js";
import { EnableMemberCommand, EnableMemberInput } from "../commands/enable.member.command.js";
import { UseGuards } from "@nestjs/common";
import type { UserAuthInfo } from "@shaastra/auth";
import { AuthGuard, AuthInfo, PositionGuard, Positions } from "@shaastra/auth";
import { TeamsQuery } from "../queries/teams.query.js";

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
		return this.queryBus.execute( new TeamsQuery( parent.id ) );
	}
}