import type { ServiceContext, UserAuthInfo } from "@api/common";
import { Res } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import type { CookieOptions, Response } from "express";
import {
	AddTeamMembersInput,
	CreateMemberInput,
	CreateTeamInput,
	EnableMemberInput,
	LoginInput,
	VerifyUserInput
} from "../inputs";
import { MemberService, TeamService, UserService } from "../services";

@Resolver()
export class MutationResolver {

	constructor(
		private readonly memberService: MemberService,
		private readonly teamService: TeamService,
		private readonly userService: UserService
	) { }

	@Mutation()
	async login( @Args( "data" ) data: LoginInput, @Context() ctx: ServiceContext ) {
		const { user, token } = await this.userService.login( data );

		const cookieOptions: CookieOptions = {
			maxAge: 9000000,
			httpOnly: true,
			domain: "localhost",
			path: "/",
			sameSite: "lax",
			secure: false
		};

		ctx.res.cookie( "auth-cookie", token, cookieOptions );

		return user.id;
	}

	@Mutation()
	async verifyUser( @Args( "data" ) data: VerifyUserInput ) {
		return this.userService.verifyUser( data );
	}

	@Mutation()
	async logout( @Res( { passthrough: true } ) res: Response, authInfo: UserAuthInfo ) {
		res.clearCookie( "auth-cookie" );
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
	async createTeam( @Args( "data" ) data: CreateTeamInput, authInfo: UserAuthInfo ) {
		return this.teamService.createTeam( data, authInfo );
	}
}
