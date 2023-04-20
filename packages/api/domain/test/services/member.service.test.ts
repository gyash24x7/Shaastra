import type { PrismaService, UserAuthInfo } from "@api/common";
import { CreateMemberInput, EnableMemberInput, MemberEvents, MemberMessages, MemberService } from "@api/domain";
import { ConflictException, NotFoundException } from "@nestjs/common";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Team } from "@prisma/client";
import { Position, Task } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Member Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();
	const mockTeam = mockDeep<Team>();
	const mockTask = mockDeep<Task>();

	it( "should return tasks created by user when getTasksCreated is called", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( { ...mockMember, tasksCreated: [ mockTask ] } as any );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const tasksCreated = await memberService.getTasksCreated( "some_id" );

		expect( tasksCreated.length ).toBe( 1 );
		expect( tasksCreated[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { tasksCreated: true }
		} );
	} );

	it( "should throw error when getTasksCreated is called and user is not found", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( null );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.getTasksCreated( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( MemberMessages.NOT_FOUND );
				expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { tasksCreated: true }
				} );
			} );
	} );

	it( "should return tasks assigned to user when getTasksAssigned is called", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( { ...mockMember, tasksAssigned: [ mockTask ] } as any );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const tasksAssigned = await memberService.getTasksAssigned( "some_id" );

		expect( tasksAssigned.length ).toBe( 1 );
		expect( tasksAssigned[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { tasksAssigned: true }
		} );
	} );

	it( "should throw error when getTasksAssigned is called and user is not found", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( null );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.getTasksAssigned( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( MemberMessages.NOT_FOUND );
				expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { tasksAssigned: true }
				} );
			} );
	} );

	it( "should return department cores when getDepartmentCores is called", async () => {
		mockPrismaService.member.findMany.mockResolvedValue( [ mockMember ] );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const cores = await memberService.getDepartmentCores( "WEBOPS" );

		expect( cores.length ).toBe( 1 );
		expect( cores[ 0 ] ).toBe( mockMember );
		expect( mockPrismaService.member.findMany )
			.toHaveBeenCalledWith( { where: { department: "WEBOPS", position: "CORE" } } );
	} );

	it( "should return teams member is part of when getTeamsPartOf is called", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( { ...mockMember, teams: [ mockTeam ] } as any );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const teams = await memberService.getTeamsPartOf( "some_id" );

		expect( teams.length ).toBe( 1 );
		expect( teams[ 0 ] ).toBe( mockTeam );
		expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { teams: true }
		} );
	} );

	it( "should throw error when getTeamsPartOf is called and user is not found", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( null );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.getTeamsPartOf( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( MemberMessages.NOT_FOUND );
				expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { teams: true }
				} );
			} );
	} );

	it( "should return members when getMembers is called", async () => {
		mockPrismaService.member.findMany.mockResolvedValue( [ mockMember ] );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const members = await memberService.getMembers( [ "some_id" ] );

		expect( members.length ).toBe( 1 );
		expect( members[ 0 ] ).toBe( mockMember );
		expect( mockPrismaService.member.findMany ).toHaveBeenCalledWith( { where: { id: { in: [ "some_id" ] } } } );
	} );

	it( "should return authenticated member when getAuthenticatedMember is called", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( mockMember );
		mockAuthInfo.id = "some_id";
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.getAuthenticatedMember( mockAuthInfo );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
	} );

	it( "should throw error when getAuthenticatedMember is called and user is not found", async () => {
		mockPrismaService.member.findUnique.mockResolvedValue( null );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.getAuthenticatedMember( { id: "some_id", department: "WEBOPS", position: "CORE" } )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( MemberMessages.NOT_FOUND );
				expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
			} );
	} );

	it( "should create new member when createMember is called", async () => {
		const { password, ...input }: CreateMemberInput = {
			department: "WEBOPS",
			password: "some_pass",
			name: "Some Name",
			email: "some@email.com",
			mobile: "123456789",
			rollNumber: "ch16b025"
		};
		mockPrismaService.member.findFirst.mockResolvedValue( null );
		mockPrismaService.member.create.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.createMember( { ...input, password } );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.create )
			.toHaveBeenCalledWith( { data: { ...input, position: Position.COORD } } );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( MemberEvents.CREATED, { ...member, password } );
	} );

	it( "should throw error when createMember is called and user already exists", async () => {
		const { password, ...input }: CreateMemberInput = {
			department: "WEBOPS",
			password: "some_pass",
			name: "Some Name",
			email: "some@email.com",
			mobile: "123456789",
			rollNumber: "ch16b025"
		};
		mockPrismaService.member.findFirst.mockResolvedValue( mockMember );
		mockPrismaService.member.create.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.createMember( { ...input, password } )
			.catch( e => {
				expect( e ).toBeInstanceOf( ConflictException );
				expect( e.getStatus() ).toBe( 409 );
				expect( e.message ).toBe( MemberMessages.ALREADY_EXISTS );
				expect( mockPrismaService.member.findFirst ).toHaveBeenCalledWith( {
					where: {
						OR: {
							email: "some@email.com",
							rollNumber: "ch16b025"
						}
					}
				} );
			} );
	} );

	it( "should enable member when enableMember is called", async () => {
		const input: EnableMemberInput = { id: "some_id" };
		mockPrismaService.member.findUnique.mockResolvedValue( mockMember );
		mockPrismaService.member.update.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.enableMember( input );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaService.member.update ).toHaveBeenCalledWith( {
			where: { id: input.id },
			data: { enabled: true }
		} );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( MemberEvents.ENABLED, mockMember );
	} );

	it( "should throw error when enableMember is called and user does not exist", async () => {
		const input: EnableMemberInput = { id: "some_id" };
		mockPrismaService.member.findUnique.mockResolvedValue( null );
		mockPrismaService.member.update.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return memberService.enableMember( input )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( MemberMessages.NOT_FOUND );
				expect( mockPrismaService.member.findUnique ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventEmitter );
	} );
} );