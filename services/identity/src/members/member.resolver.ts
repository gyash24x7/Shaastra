import { Resolver, ResolveReference } from "@nestjs/graphql";
import { QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { MemberQuery } from "./queries/member.query";
import type { Member } from "@prisma/client/identity";

@Resolver( "Member" )
export class MemberResolver {
	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Member | null> {
		return this.queryBus.execute( new MemberQuery( id ) );
	}
}