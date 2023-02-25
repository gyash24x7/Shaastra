import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { PrismaClient, User } from "../../prisma/generated";

export class UserQuery implements IQuery {
	constructor( public readonly userId: string ) {}
}

@QueryHandler( UserQuery )
export class UserQueryHandler implements IQueryHandler<UserQuery, User | null> {
	private readonly logger = LoggerFactory.getLogger( UserQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { userId }: UserQuery ): Promise<User | null> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		const user = await this.prismaService.client.user.findUnique( { where: { id: userId } } );
		this.logger.debug( "User found: %o", user );
		return user;
	}
}