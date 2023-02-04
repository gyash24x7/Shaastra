import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { PrismaClient, Message } from "@prisma/client/connect/index.js";
import { LoggerFactory, Prisma, PrismaService } from "@shaastra/framework";

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
		const messages = await this.prismaService.client.channel.findUniqueOrThrow( { where: { id: channelId } } )
			.messages();
		this.logger.debug( "Messages found: %o", messages );
		return messages;
	}
}