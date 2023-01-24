import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Message } from "@prisma/client/connect/index.js";
import { LoggerFactory } from "@shaastra/framework";
import { PrismaService } from "../prisma/prisma.service.js";

export class MessagesQuery implements IQuery {
	constructor( public readonly channelId: string ) {}
}

@QueryHandler( MessagesQuery )
export class MessagesQueryHandler implements IQueryHandler<MessagesQuery, Message[]> {
	private readonly logger = LoggerFactory.getLogger( MessagesQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { channelId }: MessagesQuery ): Promise<Message[]> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { channelId } );
		const messages = await this.prismaService.channel.findUniqueOrThrow( { where: { id: channelId } } ).messages();
		this.logger.debug( "Messages found: %o", messages );
		return messages;
	}

}