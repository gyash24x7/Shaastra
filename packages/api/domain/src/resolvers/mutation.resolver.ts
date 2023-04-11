import type { ServiceContext, UserAuthInfo } from "@api/common";
import { AuthGuard, AuthInfo } from "@api/common";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import type { CookieOptions } from "express";
import {
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
import { MemberService, TaskService, TeamService, UserService } from "../services";

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
		private readonly taskService: TaskService
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
	@UseGuards( AuthGuard )
	async logout( @Context() ctx: ServiceContext, @AuthInfo() authInfo: UserAuthInfo ) {
		ctx.res.clearCookie( "auth-cookie", cookieOptions );
		return authInfo.id;
	}

	@Mutation()
	async createMember( @Args( "data" ) data: CreateMemberInput ) {
		return this.memberService.createMember( data );
	}

	@Mutation()
	async enableMember( @Args( "data" ) data: EnableMemberInput ) {
		return this.memberService.enableMember( data );
	}

	@Mutation()
	async addTeamMembers( @Args( "data" ) data: AddTeamMembersInput ) {
		return this.teamService.addTeamMembers( data );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async createTeam( @Args( "data" ) data: CreateTeamInput, @AuthInfo() authInfo: UserAuthInfo ) {
		return this.teamService.createTeam( data, authInfo );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async createTask( @Args( "data" ) data: CreateTaskInput, @AuthInfo() authInfo: UserAuthInfo ) {
		return this.taskService.createTask( data, authInfo );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async updateTask( @Args( "data" ) data: UpdateTaskInput ) {
		return this.taskService.updateTask( data );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async assignTask( @Args( "data" ) data: AssignTaskInput ) {
		return this.taskService.assignTask( data );
	}
	
	@Mutation()
	@UseGuards( AuthGuard )
	async startTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.startTaskProgress( data );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async submitTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.submitTask( data );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async approveTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.approveTask( data );
	}

	@Mutation()
	@UseGuards( AuthGuard )
	async completeTask( @Args( "data" ) data: TaskIdInput ) {
		return this.taskService.completeTask( data );
	}
}
