import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Message, PrismaClient } from "../../prisma/generated";

export class MessagesQuery implements IQuery {
	constructor( public readonly channelId: string ) {}
}

@QueryHandler( MessagesQuery )
export class MessagesQueryHandler implements IQueryHandler<MessagesQuery, Message[]> {
	private readonly logger = LoggerFactory.getLogger( MessagesQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { channelId }: MessagesQuery ): Promise<Message[]> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { channelId } );
		const channel = await this.prismaService.client.channel.findUniqueOrThrow( {
			where: { id: channelId },
			include: { messages: true }
		} );

		this.logger.debug( "Messages found: %o", channel.messages );
		return channel.messages;
	}
}