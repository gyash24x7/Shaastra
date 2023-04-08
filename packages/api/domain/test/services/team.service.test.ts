import type { PrismaService, UserAuthInfo } from "@api/common";
import { AddTeamMembersInput, CreateTeamInput, TeamEvents, TeamService } from "@api/domain";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Prisma, Team } from "@prisma/client";
import { Department } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Team Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaTeamClient = mockDeep<Prisma.Prisma__TeamClient<Team>>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockTeam = mockDeep<Team>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the team creator when getTeamCreator is called", async () => {
		mockPrismaTeamClient.createdBy.mockResolvedValue( mockMember );
		mockPrismaService.team.findUniqueOrThrow.mockReturnValue( mockPrismaTeamClient );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const creator = await teamService.getTeamCreator( "some_team_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.team.findUniqueOrThrow )
			.toHaveBeenCalledWith( { where: { id: "some_team_id" } } );
		expect( mockPrismaTeamClient.createdBy ).toHaveBeenCalled();
	} );

	it( "should return the team members when getTeamMembers is called", async () => {
		mockPrismaTeamClient.members.mockResolvedValue( [ mockMember ] );
		mockPrismaService.team.findUniqueOrThrow.mockReturnValue( mockPrismaTeamClient );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const members = await teamService.getTeamMembers( "some_team_id" );

		expect( members.length ).toBe( 1 );
		expect( members[ 0 ] ).toBe( mockMember );
		expect( mockPrismaService.team.findUniqueOrThrow )
			.toHaveBeenCalledWith( { where: { id: "some_team_id" } } );
		expect( mockPrismaTeamClient.members ).toHaveBeenCalled();
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
		mockPrismaService.team.create.mockResolvedValue( mockTeam );
		mockAuthInfo.id = "some_member_id";
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: CreateTeamInput = { name: "Test Team", department: Department.WEBOPS };
		const newTeam = await teamService.createTeam( data, mockAuthInfo );

		expect( newTeam ).toBe( mockTeam );
		expect( mockPrismaService.team.create ).toHaveBeenCalledWith( {
			data: {
				...data,
				members: { connect: { id: "some_member_id" } },
				createdBy: { connect: { id: "some_member_id" } }
			}
		} );
	} );

	it( "should add members to the team when addTeamMembers is called", async () => {
		mockPrismaService.team.update.mockResolvedValue( mockTeam );
		const teamService = new TeamService( mockPrismaService, mockEventEmitter );
		const data: AddTeamMembersInput = { teamId: "some_team_id", memberIds: [ "some_member_id" ] };
		const team = await teamService.addTeamMembers( data );

		expect( team ).toBe( mockTeam );
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

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockPrismaTeamClient );
		mockClear( mockEventEmitter );
	} );
} );