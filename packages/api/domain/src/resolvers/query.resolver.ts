import type { UserAuthInfo } from "@api/common";
import { AuthGuard, AuthInfo } from "@api/common";
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Department } from "@prisma/client";
import { MemberService, TaskService, TeamService } from "../services";

@Resolver()
export class QueryResolver {

	constructor(
		private readonly memberService: MemberService,
		private readonly teamService: TeamService,
		private readonly taskService: TaskService
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

	@Query()
	@UseGuards( AuthGuard )
	async tasks( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.getTasks( authInfo, false );
	}

	@Query()
	@UseGuards( AuthGuard )
	async tasksRequested( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.getTasks( authInfo, true );
	}

	@Query()
	@UseGuards( AuthGuard )
	async taskActivity( @Args( "taskId" ) taskId: string ) {
		return this.taskService.getTaskActivity( taskId );
	}

	@Query()
	@UseGuards( AuthGuard )
	async taskComments( @Args( "taskId" ) taskId: string ) {
		return this.taskService.getTaskComments( taskId );
	}
}
