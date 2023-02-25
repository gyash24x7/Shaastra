import type { UserAuthInfo } from "@app/framework/auth";
import type { PrismaService } from "@app/framework/prisma";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { EventBus } from "@nestjs/cqrs";
import type { Member, PrismaClient, Team } from "@prisma/client/workforce";
import { Department, MemberPosition } from "@prisma/client/workforce";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { CreateTeamCommand, CreateTeamCommandHandler, type CreateTeamInput } from "../../src/commands";
import { TeamMessages } from "../../src/constants";
import { TeamCreatedEvent } from "../../src/events";

describe( "Create Team Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockEventBus = mockDeep<EventBus>();

	const mockCreateTeamInput: CreateTeamInput = { department: Department.WEBOPS, name: "Mock Team" };
	const mockAuthInfo: UserAuthInfo = {
		department: Department.WEBOPS,
		id: "mock-user-id",
		position: MemberPosition.COORD
	};

	const mockTeam: Team = { createdById: mockAuthInfo.id, id: "some-mock-id", ...mockCreateTeamInput };
	const mockMember = mockDeep<Member>();
	mockMember.id = mockAuthInfo.id;

	const mockTeamWithMembers = { ...mockTeam, members: [ mockMember ] };

	it( "should create new team and publish team created event", async () => {
		mockPrismaService.client.team.findUnique.mockResolvedValue( null );
		mockPrismaService.client.team.create.mockResolvedValue( mockTeamWithMembers );

		const handler = new CreateTeamCommandHandler( mockPrismaService, mockEventBus );
		const team = await handler.execute( new CreateTeamCommand( mockCreateTeamInput, mockAuthInfo ) );

		expect( mockPrismaService.client.team.findUnique ).toHaveBeenCalledWith( {
			where: { name: mockCreateTeamInput.name }
		} );

		expect( mockPrismaService.client.team.create ).toHaveBeenCalledWith( {
			data: {
				...mockCreateTeamInput,
				createdBy: { connect: { id: mockAuthInfo.id } },
				department: mockAuthInfo.department,
				members: { connect: { id: mockAuthInfo.id } }
			},
			include: { members: true }
		} );

		expect( mockEventBus.publish ).toHaveBeenCalledWith( new TeamCreatedEvent( mockTeamWithMembers ) );
		expect( team ).toEqual( mockTeamWithMembers );
	} );

	it( "should throw exception if team with same name already exists", async () => {
		mockPrismaService.client.team.findUnique.mockResolvedValue( mockTeam );
		const handler = new CreateTeamCommandHandler( mockPrismaService, mockEventBus );

		expect.assertions( 5 );
		return handler.execute( new CreateTeamCommand( mockCreateTeamInput, mockAuthInfo ) )
			.catch( ( error: HttpException ) => {
				expect( mockPrismaService.client.team.findUnique ).toHaveBeenCalledWith( {
					where: { name: mockCreateTeamInput.name }
				} );

				expect( mockPrismaService.client.team.create ).toHaveBeenCalledTimes( 0 );
				expect( mockEventBus.publish ).toHaveBeenCalledTimes( 0 );
				expect( error.getStatus() ).toBe( HttpStatus.CONFLICT );
				expect( error.message ).toBe( TeamMessages.ALREADY_EXISTS );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventBus );
	} );
} );