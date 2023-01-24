import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { User } from "@prisma/client/identity/index.js";
import { LoggerFactory } from "@shaastra/framework";
import { PrismaService } from "../prisma/prisma.service.js";

export class UserQuery implements IQuery {
	constructor( public readonly userId: string ) {}
}

@QueryHandler( UserQuery )
export class UserQueryHandler implements IQueryHandler<UserQuery, User> {
	private readonly logger = LoggerFactory.getLogger( UserQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { userId }: UserQuery ): Promise<User> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		const user = await this.prismaService.user.findUniqueOrThrow( { where: { id: userId } } );
		this.logger.debug( "User found: %o", user );
		return user;
	}

}