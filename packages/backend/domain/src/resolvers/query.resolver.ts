import type { UserAuthInfo } from "@api/common";
import { AuthGuard, AuthInfo } from "@api/common";
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Department } from "@prisma/client";
import { MemberService, TeamService } from "../services";

@Resolver()
export class QueryResolver {

	constructor(
		private readonly memberService: MemberService,
		private readonly teamService: TeamService
	) { }

	@UseGuards( AuthGuard )
	@Query()
	async me( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.memberService.getAuthenticatedMember( authInfo );
	}

	@Query()
	async teams( @Args( "department" ) department: Department ) {
		return this.teamService.getDepartmentTeams( department );
	}
}
