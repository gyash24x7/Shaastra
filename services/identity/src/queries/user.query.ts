import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { User } from "../prisma/index.js";
import { PrismaService } from "../prisma/index.js";

export class UserQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( UserQuery )
export class UserQueryHandler implements IQueryHandler<UserQuery, User | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: UserQuery ): Promise<User | null> {
		return this.prismaService.user.findUnique( { where: { id } } );
	}
}