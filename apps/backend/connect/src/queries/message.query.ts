import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Message } from "@prisma/client/connect/index.js";
import { LoggerFactory } from "@shaastra/framework";
import { PrismaService } from "../prisma/prisma.service.js";

export class MessageQuery implements IQuery {
	constructor( public readonly messageId: string ) {}
}

@QueryHandler( MessageQuery )
export class MessageQueryHandler implements IQueryHandler<MessageQuery, Message> {
	private readonly logger = LoggerFactory.getLogger( MessageQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { messageId }: MessageQuery ): Promise<Message> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { messageId } );

		const message = await this.prismaService.message.findUniqueOrThrow( { where: { id: messageId } } );
		this.logger.debug( "Message found: %o", message );

		return message;
	}

}