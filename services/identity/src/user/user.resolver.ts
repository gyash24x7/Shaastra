import { Args, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import { UserModel } from "./user.model";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserQuery } from "./user.queries";
import { AuthResponsePayload, CreateUserInput, LoginInput } from "./user.dtos";
import { CreateUserCommand, LoginCommand } from "./user.commands";
import type { GqlResolveReferenceData } from "@shaastra/utils";

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