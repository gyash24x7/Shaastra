import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMembersQuery } from "./member.queries";
import type { MemberModel } from "./member.model";
import { WorkforcePrismaService } from "@shaastra/prisma";

@QueryHandler( GetMembersQuery )
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery> {
	constructor( private readonly prismaService: WorkforcePrismaService ) {}

	execute( { data }: GetMembersQuery ): Promise<MemberModel[]> {
		return this.prismaService.member.findMany( {
			where: {
				teams: !!data.team ? { some: { name: data.team } } : undefined,
				departments: !!data.department ? { has: data.department } : undefined
			}
		} );
	}
}

export const queryHandlers = [ GetMembersQueryHandler ];