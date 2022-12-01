import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Message } from "../prisma/index.js";
import { PrismaService } from "../prisma/index.js";

export class MessageQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( MessageQuery )
export class MessageQueryHandler implements IQueryHandler<MessageQuery, Message> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: MessageQuery ): Promise<Message> {
		return this.prismaService.message.findUniqueOrThrow( { where: { id } } );
	}
}