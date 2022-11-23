import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Department, Member, MemberPosition, PrismaService } from "../prisma";

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