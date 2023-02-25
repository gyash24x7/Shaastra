import type { PrismaService } from "@app/framework/prisma";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { EventBus } from "@nestjs/cqrs";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import type { Member, PrismaClient } from "../../prisma/generated";
import { Department, MemberPosition } from "../../prisma/generated";
import { CreateMemberCommand, CreateMemberCommandHandler, type CreateMemberInput } from "../../src/commands";
import { MemberMessages } from "../../src/constants";
import { MemberCreatedEvent } from "../../src/events";

describe( "Create Member Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockEventBus = mockDeep<EventBus>();

	const mockCreateMemberInput: CreateMemberInput = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		password: "testPassword@1",
		rollNumber: "AB01C234"
	};

	const { password: mockPassword, ...mockMemberCreateData } = mockCreateMemberInput;
	const mockMember: Member = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		rollNumber: "AB01C234",
		about: "Mock About",
		coverPic: "MockCoverPicUrl",
		enabled: false,
		id: "some-mock-id",
		position: MemberPosition.COORD,
		profilePic: "MockProfilePicUrl",
		upi: "upi@mockbank"
	};

	it( "should create the member and publish the member created event", async () => {
		mockPrismaService.client.member.findFirst.mockResolvedValue( null );
		mockPrismaService.client.member.create.mockResolvedValue( mockMember );

		const handler = new CreateMemberCommandHandler( mockPrismaService, mockEventBus );
		const member = await handler.execute( new CreateMemberCommand( mockCreateMemberInput ) );

		expect( mockPrismaService.client.member.findFirst ).toHaveBeenCalledWith( {
			where: {
				OR: {
					email: mockCreateMemberInput.email,
					rollNumber: mockCreateMemberInput.rollNumber
				}
			}
		} );

		expect( mockPrismaService.client.member.create ).toHaveBeenCalledWith( {
			data: { ...mockMemberCreateData, position: MemberPosition.COORD }
		} );

		expect( mockEventBus.publish ).toHaveBeenCalledWith(
			new MemberCreatedEvent( { ...mockMember, password: mockPassword } )
		);

		expect( member ).toEqual( mockMember );
	} );

	it( "should throw exception if user already exists with same email or roll number", async () => {
		mockPrismaService.client.member.findFirst.mockResolvedValue( mockMember );

		const handler = new CreateMemberCommandHandler( mockPrismaService, mockEventBus );

		expect.assertions( 5 );
		return handler.execute( new CreateMemberCommand( mockCreateMemberInput ) )
			.catch( ( error: HttpException ) => {
				expect( mockPrismaService.client.member.findFirst ).toHaveBeenCalledWith( {
					where: {
						OR: {
							email: mockCreateMemberInput.email,
							rollNumber: mockCreateMemberInput.rollNumber
						}
					}
				} );

				expect( mockPrismaService.client.member.create ).toHaveBeenCalledTimes( 0 );
				expect( mockEventBus.publish ).toHaveBeenCalledTimes( 0 );
				expect( error.getStatus() ).toBe( HttpStatus.CONFLICT );
				expect( error.message ).toBe( MemberMessages.ALREADY_EXISTS );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventBus );
	} );
} );