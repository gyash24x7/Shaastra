import type { PrismaService, UserAuthInfo } from "@api/common";
import { CreateMemberInput, EnableMemberInput, MemberEvents, MemberMessages, MemberService } from "@api/domain";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Team } from "@prisma/client";
import { MemberPosition, Prisma } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Member Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaMemberClient = mockDeep<Prisma.Prisma__MemberClient<Member>>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();
	const mockTeam = mockDeep<Team>();

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
		mockPrismaMemberClient.teams.mockResolvedValue( [ mockTeam ] );
		mockPrismaService.member.findUniqueOrThrow.mockReturnValue( mockPrismaMemberClient );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const teams = await memberService.getTeamsPartOf( "some_id" );

		expect( teams.length ).toBe( 1 );
		expect( teams[ 0 ] ).toBe( mockTeam );
		expect( mockPrismaService.member.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaMemberClient.teams ).toHaveBeenCalled();
		expect( mockPrismaService.handleException )
			.toHaveBeenCalledWith( { code: "P2025", message: MemberMessages.NOT_FOUND } );
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
		mockPrismaService.member.findUniqueOrThrow.mockResolvedValue( mockMember );
		mockAuthInfo.id = "some_id";
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.getAuthenticatedMember( mockAuthInfo );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaService.handleException )
			.toHaveBeenCalledWith( { code: "P2025", message: MemberMessages.NOT_FOUND } );
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
		mockPrismaService.member.create.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.createMember( { ...input, password } );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.create )
			.toHaveBeenCalledWith( { data: { ...input, position: MemberPosition.COORD } } );
		expect( mockPrismaService.handleException )
			.toHaveBeenCalledWith( { code: "P2002", message: MemberMessages.ALREADY_EXISTS } );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( MemberEvents.CREATED, { ...member, password } );
	} );

	it( "should enable member when enableMember is called", async () => {
		const input: EnableMemberInput = { id: "some_id" };
		mockPrismaService.member.update.mockResolvedValue( mockMember );
		const memberService = new MemberService( mockPrismaService, mockEventEmitter );
		const member = await memberService.enableMember( input );

		expect( member ).toBe( mockMember );
		expect( mockPrismaService.member.update ).toHaveBeenCalledWith( {
			where: { id: input.id },
			data: { enabled: true }
		} );
		expect( mockPrismaService.handleException )
			.toHaveBeenCalledWith( { code: "P2025", message: MemberMessages.NOT_FOUND } );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( MemberEvents.ENABLED, mockMember );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventEmitter );
	} );
} );