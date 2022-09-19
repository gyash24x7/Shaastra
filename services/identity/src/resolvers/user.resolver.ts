import { Args, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils";
import { UserModel } from "../models/user.model";
import { GetUserQuery } from "../queries/user/get-user.query";
import { AuthResponsePayload, CreateUserInput, LoginInput } from "../dtos/user.dtos";
import { LoginCommand } from "../commands/user/login.command";
import { CreateUserCommand } from "../commands/user/create-user.command";

@Resolver( UserModel.TYPENAME )
export class UserResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Query( () => UserModel )
	getMe() {
		return this.queryBus.execute<GetUserQuery, UserModel>( new GetUserQuery( "" ) );
	}

	@Mutation( () => AuthResponsePayload )
	login( @Args( "data" ) data: LoginInput ) {
		return this.commandBus.execute<LoginCommand, AuthResponsePayload>( new LoginCommand( data ) );
	}

	@Mutation( () => AuthResponsePayload )
	createUser( @Args( "data" ) data: CreateUserInput ) {
		return this.commandBus.execute<CreateUserCommand, AuthResponsePayload>( new CreateUserCommand( data ) );
	}

	@ResolveReference()
	resolveReference( reference: GqlResolveReferenceData ) {
		return this.queryBus.execute<GetUserQuery, UserModel>( new GetUserQuery( reference.id ) );
	}
}