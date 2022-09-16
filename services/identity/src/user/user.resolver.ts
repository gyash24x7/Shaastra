import { Args, Mutation, Query, Resolver, ResolveReference } from "@nestjs/graphql";
import { UserModel } from "./user.model";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserQuery } from "./user.queries";
import { LoginInput, LoginResponsePayload } from "./user.dtos";
import { LoginCommand } from "./user.commands";
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

	@Mutation( () => LoginResponsePayload )
	login( @Args( "data" ) data: LoginInput ) {
		return this.commandBus.execute<LoginCommand, LoginResponsePayload>( new LoginCommand( data ) );
	}

	@ResolveReference()
	resolveReference( reference: GqlResolveReferenceData ) {
		return this.queryBus.execute<GetUserQuery, UserModel>( new GetUserQuery( reference.id ) );
	}
}