import type { UserAuthInfo } from "@api/common";
import { AuthGuard, AuthInfo } from "@api/common";
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Department } from "@prisma/client";
import { MemberService, TaskService, TeamService } from "../services";
import type { TaskActivityService } from "../services/task.activity.service";

@Resolver()
export class QueryResolver {

	constructor(
		private readonly memberService: MemberService,
		private readonly teamService: TeamService,
		private readonly taskService: TaskService,
		private readonly taskActivityService: TaskActivityService
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
		return this.taskActivityService.getTaskActivity( taskId );
	}
}
