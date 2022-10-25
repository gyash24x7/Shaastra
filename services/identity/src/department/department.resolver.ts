import { Resolver, ResolveReference } from "@nestjs/graphql";
import { QueryBus } from "@nestjs/cqrs";
import type { GqlResolveReferenceData } from "@shaastra/utils/graphql";
import { DepartmentQuery } from "./queries/department.query";
import type { Department } from "@prisma/client/identity";

@Resolver( "Department" )
export class DepartmentResolver {
	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference()
	resolveReference( { id }: GqlResolveReferenceData ): Promise<Department | null> {
		return this.queryBus.execute( new DepartmentQuery( id ) );
	}
}