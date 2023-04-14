import type { ServiceContext, UserAuthInfo } from "@api/common";
import {
	AddTaskCommentInput,
	AddTeamMembersInput,
	AssignTaskInput,
	cookieOptions,
	CreateMemberInput,
	CreateTaskInput,
	CreateTeamInput,
	EnableMemberInput,
	LoginInput,
	MemberService,
	MutationResolver,
	TaskCommentService,
	TaskIdInput,
	TaskService,
	TeamService,
	UpdateTaskInput,
	UserService,
	VerifyUserInput
} from "@api/domain";
import { Department, Member, Task, TaskComment, Team, User } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import dayjs from "dayjs";

describe( "MutationResolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockUserService = mockDeep<UserService>();
	const mockTeamService = mockDeep<TeamService>();
	const mockTaskService = mockDeep<TaskService>();
	const mockTaskCommentService = mockDeep<TaskCommentService>();
	const mockServiceContext = mockDeep<ServiceContext>();
	const mockUser = mockDeep<User>();
	const mockTeam = mockDeep<Team>();
	const mockMember = mockDeep<Member>();
	const mockTask = mockDeep<Task>();
	const mockTaskComment = mockDeep<TaskComment>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should login user, set cookies and return user id when login is called", async () => {
		mockUser.id = "some_id";
		mockUserService.login.mockResolvedValue( { user: mockUser, token: "some_token" } );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: LoginInput = { username: "some_username", password: "some_password" };
		const userId = await mutationResolver.login( data, mockServiceContext );

		expect( userId ).toBe( "some_id" );
		expect( mockServiceContext.res.cookie )
			.toHaveBeenCalledWith( "auth-cookie", "some_token", cookieOptions );
		expect( mockUserService.login ).toHaveBeenCalledWith( data );
	} );

	it( "should logout user, set cookies and return user id when logout is called", async () => {
		mockAuthInfo.id = "some_id";
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const userId = await mutationResolver.logout( mockServiceContext, mockAuthInfo );

		expect( userId ).toBe( "some_id" );
		expect( mockServiceContext.res.clearCookie ).toHaveBeenCalledWith( "auth-cookie", cookieOptions );
	} );

	it( "should verify user and return it when verifyUser is called", async () => {
		mockUserService.verifyUser.mockResolvedValue( mockUser );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: VerifyUserInput = { userId: "some_user_id", hash: "some_token_hash" };
		const userId = await mutationResolver.verifyUser( data );

		expect( userId ).toBe( mockUser );
		expect( mockUserService.verifyUser ).toHaveBeenCalledWith( data );
	} );

	it( "should create member and return it when createMember is called", async () => {
		mockMemberService.createMember.mockResolvedValue( mockMember );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: CreateMemberInput = mockDeep<CreateMemberInput>();
		const member = await mutationResolver.createMember( data );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.createMember ).toHaveBeenCalledWith( data );
	} );

	it( "should enable member and return it when enableMember is called", async () => {
		mockMemberService.enableMember.mockResolvedValue( mockMember );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: EnableMemberInput = { id: "some_id" };
		const member = await mutationResolver.enableMember( data );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.enableMember ).toHaveBeenCalledWith( data );
	} );

	it( "should create team and return it when createTeam is called", async () => {
		mockTeamService.createTeam.mockResolvedValue( mockTeam );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: CreateTeamInput = { name: "some_team_name", department: Department.CONCEPT_AND_DESIGN };
		const team = await mutationResolver.createTeam( data, mockAuthInfo );

		expect( team ).toBe( mockTeam );
		expect( mockTeamService.createTeam ).toHaveBeenCalledWith( data, mockAuthInfo );
	} );

	it( "should add team members and return team when addTeamMembers is called", async () => {
		mockTeamService.addTeamMembers.mockResolvedValue( mockTeam );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: AddTeamMembersInput = { teamId: "some_user_id", memberIds: [ "some_member_id" ] };
		const team = await mutationResolver.addTeamMembers( data );

		expect( team ).toBe( mockTeam );
		expect( mockTeamService.addTeamMembers ).toHaveBeenCalledWith( data );
	} );

	it( "should create and return new task when createTask is called", async () => {
		mockTaskService.createTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: CreateTaskInput = {
			title: "task title",
			description: "task description",
			deadline: dayjs().toString(),
			forDepartment: Department.WEBOPS
		};
		const task = await mutationResolver.createTask( data, mockAuthInfo );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.createTask ).toHaveBeenCalledWith( data, mockAuthInfo );
	} );

	it( "should update and return task when completeTask is called", async () => {
		mockTaskService.updateTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: UpdateTaskInput = { taskId: "some_task_id" };
		const task = await mutationResolver.updateTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.updateTask ).toHaveBeenCalledWith( data );
	} );

	it( "should assign and return task when assignTask is called", async () => {
		mockTaskService.assignTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: AssignTaskInput = { taskId: "some_task_id", assigneeId: "some_member_id" };
		const task = await mutationResolver.assignTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.assignTask ).toHaveBeenCalledWith( data );
	} );

	it( "should start progress and return task when startTask is called", async () => {
		mockTaskService.startTaskProgress.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: TaskIdInput = { taskId: "some_task_id" };
		const task = await mutationResolver.startTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.startTaskProgress ).toHaveBeenCalledWith( data );
	} );

	it( "should submit and return task when submitTask is called", async () => {
		mockTaskService.submitTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: TaskIdInput = { taskId: "some_task_id" };
		const task = await mutationResolver.submitTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.submitTask ).toHaveBeenCalledWith( data );
	} );

	it( "should approve and return task when approveTask is called", async () => {
		mockTaskService.approveTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: TaskIdInput = { taskId: "some_task_id" };
		const task = await mutationResolver.approveTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.approveTask ).toHaveBeenCalledWith( data );
	} );

	it( "should complete and return task when completeTask is called", async () => {
		mockTaskService.completeTask.mockResolvedValue( mockTask );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: TaskIdInput = { taskId: "some_task_id" };
		const task = await mutationResolver.completeTask( data );

		expect( task ).toBe( mockTask );
		expect( mockTaskService.completeTask ).toHaveBeenCalledWith( data );
	} );

	it( "should add new comment to the task when addTaskComment is called", async () => {
		mockTaskCommentService.addTaskComment.mockResolvedValue( mockTaskComment );
		const mutationResolver = new MutationResolver(
			mockMemberService,
			mockTeamService,
			mockUserService,
			mockTaskService,
			mockTaskCommentService
		);
		const data: AddTaskCommentInput = { taskId: "some_task_id", content: "task comment content" };
		const taskComment = await mutationResolver.addTaskComment( data, mockAuthInfo );

		expect( taskComment ).toBe( mockTaskComment );
		expect( mockTaskCommentService.addTaskComment ).toHaveBeenCalledWith( data, mockAuthInfo );
	} );

	afterEach( () => {
		mockClear( mockServiceContext );
		mockClear( mockMemberService );
		mockClear( mockUserService );
		mockClear( mockTeamService );
		mockClear( mockTaskCommentService );
	} );
} );