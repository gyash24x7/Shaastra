import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "./user.queries";
import type { UserModel } from "./user.model";
import { IdentityPrismaService } from "@shaastra/prisma";

@QueryHandler( GetUserQuery )
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
	constructor( private readonly prismaService: IdentityPrismaService ) {}

	execute( { id }: GetUserQuery ): Promise<UserModel | null> {
		return this.prismaService.user.findUnique( { where: { id } } );
	}
}

export const queryHandlers = [ GetUserQueryHandler ];