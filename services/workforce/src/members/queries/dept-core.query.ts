import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "../../prisma/prisma.service";
import type { Department, Member } from "@prisma/client/workforce";
import { MemberPosition } from "@prisma/client/workforce";

export class DeptCoreQuery implements IQuery {
	constructor( public readonly department: Department ) {}
}

@QueryHandler( DeptCoreQuery )
export class DeptCoreQueryHandler implements IQueryHandler<DeptCoreQuery, Member> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { department }: DeptCoreQuery ): Promise<Member> {
		return this.prismaService.member.findFirstOrThrow( {
			where: { department, position: MemberPosition.CORE }
		} );
	}
}