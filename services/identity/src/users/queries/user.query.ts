import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { User } from "@prisma/client/identity";
import { IdentityPrismaService } from "../../app/identity.prisma.service";

export class UserQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( UserQuery )
export class UserQueryHandler implements IQueryHandler<UserQuery, User | null> {
	constructor( private readonly prismaService: IdentityPrismaService ) {}

	execute( { id }: UserQuery ): Promise<User | null> {
		return this.prismaService.user.findUnique( { where: { id }, include: { roles: true } } );
	}
}