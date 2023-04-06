import { MemberEventsListener, MemberService, UserService } from "@api/domain";
import type { Member, User } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Member Events Listener", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockUserService = mockDeep<UserService>();
	const mockUser = mockDeep<User>();
	const mockMember = mockDeep<Member>();

	it( "should create user whenever new member is created", async () => {
		mockMember.id = "some_id";
		mockMember.department = "WEBOPS";
		mockUserService.createUser.mockResolvedValue( mockUser );
		mockMemberService.getDepartmentCores.mockResolvedValue( [ mockMember ] );
		const memberEventsListener = new MemberEventsListener( mockMemberService, mockUserService );
		await memberEventsListener.handleMemberCreatedEvent( { ...mockMember, password: "some_password" } );

		expect( mockMemberService.getDepartmentCores ).toHaveBeenCalledWith( "WEBOPS" );
		expect( mockUserService.createUser ).toHaveBeenCalledWith(
			expect.objectContaining( {
				id: "some_id",
				password: "some_password"
			} )
		);
	} );

	it( "should send mail whenever a member is enabled", async () => {
		const memberEventsListener = new MemberEventsListener( mockMemberService, mockUserService );
		await memberEventsListener.handleMemberEnabledEvent( mockMember );
	} );
} );