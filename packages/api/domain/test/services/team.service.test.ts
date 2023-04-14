import type { PrismaService, UserAuthInfo } from "@api/common";
import { AddTeamMembersInput, CreateTeamInput, TeamEvents, TeamMessages, TeamService } from "@api/domain";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Team } from "@prisma/client";
import { Department } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe( "Team Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockTeam = mockDeep<Team>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the team creator when getTeamCreator is called", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( { ...mockTeam, createdBy: mockMember } as any );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const creator = await teamService.getTeamCreator( "some_team_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_team_id" },
			include: { createdBy: true }
		} );
	} );

	it( "should throw error when getTeamCreator is called and team is not found", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( null );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return teamService.getTeamCreator( "some_team_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TeamMessages.NOT_FOUND );
				expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_team_id" },
					include: { createdBy: true }
				} );
			} );
	} );

	it( "should return the team members when getTeamMembers is called", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( { ...mockTeam, members: [ mockMember ] } as any );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const members = await teamService.getTeamMembers( "some_team_id" );

		expect( members.length ).toBe( 1 );
		expect( members[ 0 ] ).toBe( mockMember );
		expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_team_id" },
			include: { members: true }
		} );
	} );

	it( "should throw error when getTeamMembers is called and team is not found", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( null );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return teamService.getTeamMembers( "some_team_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TeamMessages.NOT_FOUND );
				expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_team_id" },
					include: { members: true }
				} );
			} );
	} );

	it( "should return teams related to the department when getDepartmentTeams is called", async () => {
		mockPrismaService.team.findMany.mockResolvedValue( [ mockTeam ] );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const teams = await teamService.getDepartmentTeams( Department.WEBOPS );

		expect( teams.length ).toBe( 1 );
		expect( teams[ 0 ] ).toBe( mockTeam );
		expect( mockPrismaService.team.findMany )
			.toHaveBeenCalledWith( { where: { department: Department.WEBOPS } } );
	} );

	it( "should create a new team when createTeam is called", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( null );
		mockPrismaService.team.create.mockResolvedValue( mockTeam );
		mockAuthInfo.id = "some_member_id";
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: CreateTeamInput = { name: "Test Team", department: Department.WEBOPS };
		const newTeam = await teamService.createTeam( data, mockAuthInfo );

		expect( newTeam ).toBe( mockTeam );
		expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( { where: { name: "Test Team" } } );
		expect( mockPrismaService.team.create ).toHaveBeenCalledWith( {
			data: {
				...data,
				members: { connect: { id: "some_member_id" } },
				createdBy: { connect: { id: "some_member_id" } }
			}
		} );
	} );

	it( "should throw error when createTeam is called and team with same name exists", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( mockTeam );
		mockAuthInfo.id = "some_member_id";
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: CreateTeamInput = { name: "Test Team", department: Department.WEBOPS };

		expect.assertions( 4 );
		return teamService.createTeam( data, mockAuthInfo )
			.catch( e => {
				expect( e ).toBeInstanceOf( ConflictException );
				expect( e.getStatus() ).toBe( 409 );
				expect( e.message ).toBe( TeamMessages.ALREADY_EXISTS );
				expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( { where: { name: "Test Team" } } );
			} );
	} );

	it( "should add members to the team when addTeamMembers is called", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( mockTeam );
		mockPrismaService.team.update.mockResolvedValue( mockTeam );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: AddTeamMembersInput = { teamId: "some_team_id", memberIds: [ "some_member_id" ] };
		const team = await teamService.addTeamMembers( data );

		expect( team ).toBe( mockTeam );
		expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( { where: { id: "some_team_id" } } );
		expect( mockPrismaService.team.update ).toHaveBeenCalledWith( {
			where: { id: "some_team_id" },
			data: {
				members: {
					connect: [ { id: "some_member_id" } ]
				}
			}
		} );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith(
			TeamEvents.MEMBERS_ADDED,
			{ ...mockTeam, memberIds: [ "some_member_id" ] }
		);
	} );

	it( "should throw error when addTeamMembers is called and team does not exist", async () => {
		mockPrismaService.team.findUnique.mockResolvedValue( null );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: AddTeamMembersInput = { teamId: "some_team_id", memberIds: [ "some_member_id" ] };

		return teamService.addTeamMembers( data )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TeamMessages.NOT_FOUND );
				expect( mockPrismaService.team.findUnique ).toHaveBeenCalledWith( { where: { id: "some_team_id" } } );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventEmitter );
	} );
} );