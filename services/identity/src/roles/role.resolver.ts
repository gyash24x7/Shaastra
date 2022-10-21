import { Resolver, ResolveReference } from "@nestjs/graphql";
import { QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { RoleQuery } from "./queries/role.query";
import type { Role } from "@prisma/client/identity";

@Resolver( "Role" )
export class RoleResolver {
	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Role | null> {
		return this.queryBus.execute( new RoleQuery( id ) );
	}
}