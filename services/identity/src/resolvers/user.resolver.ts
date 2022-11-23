import { Args, Context, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlContext, GqlResolveReferenceData } from "@shaastra/utils";
import { UserQuery } from "../queries/user.query";
import { LoginCommand, LoginInput } from "../commands/login.command";
import { AuthGuard, AuthInfo, UserAuthInfo } from "@shaastra/auth";
import { UseGuards } from "@nestjs/common";
import { VerifyUserCommand, VerifyUserInput } from "../commands/verify.user.command";
import type { User } from "../prisma";
import { UserModel } from "../models/user.model";

@Resolver( () => UserModel )
export class UserResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@UseGuards( AuthGuard )
	@Query( () => String )
	authInfo( @AuthInfo() authInfo: UserAuthInfo ): string {
		return JSON.stringify( authInfo );
	}

	@Mutation( () => Boolean )
	async login( @Args( "data" ) data: LoginInput, @Context() ctx: GqlContext ): Promise<boolean> {
		const token: string = await this.commandBus.execute( new LoginCommand( data ) );
		ctx.res.setHeader( "x-access-token", token );
		return !!token;
	}

	@Mutation( () => String )
	async verifyUser( @Args( "data" ) data: VerifyUserInput ): Promise<string> {
		return this.commandBus.execute( new VerifyUserCommand( data ) );
	}

	@UseGuards( AuthGuard )
	@Mutation( () => Boolean )
	logout( @Context() ctx: GqlContext, @AuthInfo() authInfo: UserAuthInfo ): boolean {
		ctx.res.setHeader( "x-logout", authInfo.id );
		return true;
	}

	@ResolveReference()
	resolveReference( reference: GqlResolveReferenceData ): Promise<User> {
		return this.queryBus.execute( new UserQuery( reference.id ) );
	}
}