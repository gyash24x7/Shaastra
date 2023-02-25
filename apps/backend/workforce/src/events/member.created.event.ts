import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import { RedisClient } from "@app/framework/redis";
import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import type { PrismaClient } from "@prisma/client/workforce";
import { type Member, MemberPosition } from "@prisma/client/workforce";
import { OutboundEvents } from "../constants";

export class MemberCreatedEvent implements IEvent {
	constructor( public readonly data: Member & { password: string } ) {}
}

@EventsHandler( MemberCreatedEvent )
export class MemberCreatedEventHandler implements IEventHandler<MemberCreatedEvent> {
	private readonly logger = LoggerFactory.getLogger( MemberCreatedEventHandler );

	constructor(
		@RedisClient() private readonly redisClient: ClientProxy,
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>
	) {}

	async handle( { data }: MemberCreatedEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		const member = await this.prismaService.client.member.findFirst( {
			where: { department: data.department, position: MemberPosition.CORE }
		} );

		const subject = `New Member requested to join ${ data.department }`;
		const content = `Please log in to Shaastra Prime and approve this request.`;
		// await this.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
		this.logger.debug( `Need to send mail here!` );
		this.logger.debug( `Subject: ${ subject }` );
		this.logger.debug( `Content: ${ content }` );
		this.logger.debug( `Member: ${ member?.name }` );

		this.redisClient.emit( OutboundEvents.MEMBER_CREATED, data );
	}
}