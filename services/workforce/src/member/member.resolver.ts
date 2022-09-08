import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@shaastra/auth";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateMemberInput, EnableMemberInput, GetMembersInput } from "./member.inputs";
import { GetMembersQuery } from "./member.queries";
import { MemberModel } from "./member.model";
import { CreateMemberCommand, EnableMemberCommand } from "./member.commands";

@Resolver( MemberModel.TYPENAME )
@UseGuards( AuthGuard )
export class MemberResolver {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Query( () => [ MemberModel ] )
	async getMembers( @Args( "data" ) data: GetMembersInput ) {
		return this.queryBus.execute<GetMembersQuery, MemberModel[]>( new GetMembersQuery( data ) );
	}

	@Mutation( () => Boolean )
	async createMember( @Args( "data" ) data: CreateMemberInput ) {
		await this.commandBus.execute( new CreateMemberCommand( data ) );
	}

	@Mutation( () => Boolean )
	async enableMember( @Args( "data" ) data: EnableMemberInput ) {
		await this.commandBus.execute( new EnableMemberCommand( data ) );
	}
}
