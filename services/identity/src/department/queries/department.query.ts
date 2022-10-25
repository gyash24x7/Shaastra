import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Department } from "@prisma/client/identity";
import { PrismaService } from "../../prisma/prisma.service";

export class DepartmentQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( DepartmentQuery )
export class DepartmentQueryHandler implements IQueryHandler<DepartmentQuery, Department | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: DepartmentQuery ): Promise<Department | null> {
		return this.prismaService.department.findUnique( { where: { id } } );
	}
}