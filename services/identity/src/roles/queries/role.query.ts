import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Role } from "@prisma/client/identity";
import { PrismaService } from "../../prisma/prisma.service";

export class RoleQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( RoleQuery )
export class RoleQueryHandler implements IQueryHandler<RoleQuery, Role | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: RoleQuery ): Promise<Role | null> {
		return this.prismaService.role.findUnique( { where: { id } } );
	}
}