import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Message, PrismaClient } from "../../prisma/generated";

export class MessageQuery implements IQuery {
	constructor( public readonly messageId: string ) {}
}

@QueryHandler( MessageQuery )
export class MessageQueryHandler implements IQueryHandler<MessageQuery, Message> {
	private readonly logger = LoggerFactory.getLogger( MessageQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { messageId }: MessageQuery ): Promise<Message> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { messageId } );

		const message = await this.prismaService.client.message.findUniqueOrThrow( { where: { id: messageId } } );
		this.logger.debug( "Message found: %o", message );

		return message;
	}
}