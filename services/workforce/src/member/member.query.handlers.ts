import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMembersQuery } from "./member.queries";
import type { MemberModel } from "./member.model";
import { PrismaService } from "../prisma/prisma.service";

@QueryHandler( GetMembersQuery )
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { data }: GetMembersQuery ): Promise<MemberModel[]> {
		return this.prismaService.member.findMany( {
			where: {
				teams: !!data.team ? { some: { name: data.team } } : undefined,
				departments: !!data.department ? { has: data.department } : undefined
			}
		} );
	}

}