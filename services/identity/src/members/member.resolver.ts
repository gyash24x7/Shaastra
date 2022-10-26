import { Args, Mutation, Parent, ResolveField, Resolver, ResolveReference } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { MemberQuery } from "./queries/member.query";
import type { Member, User } from "@prisma/client/identity";
import type { CreateMemberInput } from "./commands/create.member.command";
import { CreateMemberCommand } from "./commands/create.member.command";
import type { EnableMemberInput } from "./commands/enable.member.command";
import { EnableMemberCommand } from "./commands/enable.member.command";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@shaastra/auth";
import { UserQuery } from "../users/queries/user.query";

@Resolver( "Member" )
export class MemberResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Mutation()
	async createMember( @Args( "data" ) data: CreateMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new CreateMemberCommand( data ) );
	}

	@UseGuards( AuthGuard )
	@Mutation()
	async enableMember( @Args( "data" ) data: EnableMemberInput ): Promise<boolean> {
		return this.commandBus.execute( new EnableMemberCommand( data ) );
	}

	@ResolveField()
	async user( @Parent() { userId }: Member ): Promise<User> {
		return this.queryBus.execute( new UserQuery( userId ) );
	}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Member | null> {
		return this.queryBus.execute( new MemberQuery( id ) );
	}
}