import type { IQuery } from "@nestjs/cqrs";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { UserModel } from "../../models/user.model";
import { PrismaService } from "../../services/prisma.service";

export class GetUserQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( GetUserQuery )
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, UserModel | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: GetUserQuery ): Promise<UserModel | null> {
		return this.prismaService.user.findUnique( { where: { id } } );
	}
}