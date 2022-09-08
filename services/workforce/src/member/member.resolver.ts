import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@shaastra/auth";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateMemberInput, GetMembersInput } from "./member.inputs";
import { GetMembersQuery } from "./member.queries";
import { MemberModel } from "./member.model";
import { CreateMemberCommand } from "./member.commands";

@Resolver( MemberModel.TYPENAME )
export class MemberResolver {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@UseGuards( AuthGuard )
	@Query( () => [ MemberModel ] )
	async getMembers( @Args( "data" ) data: GetMembersInput ) {
		return this.queryBus.execute<GetMembersQuery, MemberModel[]>( new GetMembersQuery( data ) );
	}

	@UseGuards( AuthGuard )
	@Mutation( () => Boolean )
	async createMember( @Args( "data" ) data: CreateMemberInput ) {
		await this.commandBus.execute( new CreateMemberCommand( data ) );
	}
}
