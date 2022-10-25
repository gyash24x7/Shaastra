import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "../../prisma/prisma.service";
import type { MemberWithUser } from "./member.query";
import type { Department } from "@prisma/client/identity";
import { MemberPosition } from "@prisma/client/identity";

export class DeptCoreQuery implements IQuery {
	constructor( public readonly department: Department ) {}
}

@QueryHandler( DeptCoreQuery )
export class DeptCoreQueryHandler implements IQueryHandler<DeptCoreQuery, MemberWithUser> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { department }: DeptCoreQuery ): Promise<MemberWithUser> {
		return this.prismaService.member.findFirstOrThrow( {
			where: { department, position: MemberPosition.CORE },
			include: { user: true }
		} );
	}
}