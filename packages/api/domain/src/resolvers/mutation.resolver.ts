import type { ServiceContext, UserAuthInfo } from "@api/common";
import { AuthInfo, RequiresAuth, RequiresPosition } from "@api/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import type { CookieOptions } from "express";
import {
	AddTaskCommentInput,
	AddTeamMembersInput,
	AssignTaskInput,
	CreateMemberInput,
	CreateTaskInput,
	CreateTeamInput,
	EnableMemberInput,
	LoginInput,
	TaskIdInput,
	UpdateTaskInput,
	VerifyUserInput
} from "../inputs";
import { MemberService, TaskCommentService, TaskService, TeamService, UserService } from "../services";
import { MemberPosition } from "@prisma/client";

export const cookieOptions: CookieOptions = {
	maxAge: 9000000,
	httpOnly: true,
	domain: "localhost",
	path: "/",
	sameSite: "lax",
	secure: false
};

@Resolver()
export class MutationResolver {

	constructor(
		private readonly memberService: MemberService,
		private readonly teamService: TeamService,
		private readonly userService: UserService,
		private readonly taskService: TaskService,
		private readonly taskCommentService: TaskCommentService
	) { }

	@Mutation()
	async login( @Args( "data" ) data: LoginInput, @Context() ctx: ServiceContext ) {
		const { user, token } = await this.userService.login( data );
		ctx.res.cookie( "auth-cookie", token, cookieOptions );
		return user.id;
	}

	@Mutation()
	async verifyUser( @Args( "data" ) data: VerifyUserInput ) {
		return this.userService.verifyUser( data );
	}

	@Mutation()
	@RequiresAuth()
	async logout( @Context() ctx: ServiceContext, @AuthInfo() authInfo: UserAuthInfo ) {
		ctx.res.clearCookie( "auth-cookie", cookieOptions );
		return authInfo.id;
	}

	@Mutation()
	async createMember( @Args( "data" ) data: CreateMemberInput ) {
		return this.memberService.createMember( data );
	}

	@Mutation()
	@RequiresAuth()
	@RequiresPosition( MemberPosition.CORE )
	async enableMember( @Args( "data" ) data: EnableMemberInput ) {
		return this.memberService.enableMember( data );
	}

	@Mutation()
	@RequiresAuth()
	@RequiresPosition( MemberPosition.CORE )
	async addTeamMembers( @Args( "data" ) data: AddTeamMembersInput ) {
		return this.teamService.addTeamMembers( data );
	}

	@Mutation()
	@RequiresAuth()
	@RequiresPosition( MemberPosition.CORE )
	async createTeam( @Args( "data" ) data: CreateTeamInput, @AuthInfo() authInfo: UserAuthInfo ) {
		return this.teamService.createTeam( data, authInfo );
	}

	@Mutation()
	@RequiresAuth()
	async createTask( @Args( "data" ) data: CreateTaskInput, @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.createTask( data, authInfo );
	}

	@Mutation()
	@RequiresAuth()
	async updateTask( @Args( "data" ) data: UpdateTaskInput ) {
		return this.taskService.updateTask( data );
	}

	@Mutation()
	@RequiresAuth()
	async assignTask( @Args( "data" ) data: AssignTaskInput ) {
		return this.taskService.assignTask( data );
	}

	@Mutation()
	@RequiresAuth()
	async startTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.startTaskProgress( data );
	}

	@Mutation()
	@RequiresAuth()
	async submitTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.submitTask( data );
	}

	@Mutation()
	@RequiresAuth()
	async approveTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.approveTask( data );
	}

	@Mutation()
	@RequiresAuth()
	async completeTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.completeTask( data );
	}

	@Mutation()
	@RequiresAuth()
	async addTaskComment( @Args( "data" ) data: AddTaskCommentInput, @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskCommentService.addTaskComment( data, authInfo );
	}
}
