import type { UserAuthInfo } from "@api/common";
import { AuthInfo, RequiresAuth } from "@api/common";
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

	@Query()
	@RequiresAuth()
	async me( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.memberService.getAuthenticatedMember( authInfo );
	}

	@Query()
	@RequiresAuth()
	async teams( @Args( "department" ) department: Department ) {
		return this.teamService.getDepartmentTeams( department );
	}

	@Query()
	@RequiresAuth()
	async tasks( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.getTasks( authInfo, false );
	}

	@Query()
	@RequiresAuth()
	async tasksRequested( @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.getTasks( authInfo, true );
	}

	@Query()
	@RequiresAuth()
	async taskActivity( @Args( "taskId" ) taskId: string ) {
		return this.taskService.getTaskActivity( taskId );
	}

	@Query()
	@RequiresAuth()
	async taskComments( @Args( "taskId" ) taskId: string ) {
		return this.taskService.getTaskComments( taskId );
	}
}
