import { LoggerFactory, PrismaService } from "@api/common";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { Team } from "@prisma/client";

export class TeamEvents {
	public static readonly MEMBERS_ADDED = "team.membersAdded";
}

@Injectable()
export class TeamEventsListener {
	private readonly logger = LoggerFactory.getLogger( TeamEventsListener );

	constructor( private readonly prismaService: PrismaService ) { }

	@OnEvent( TeamEvents.MEMBERS_ADDED )
	async handleMembersAddedEvent( data: Team & { memberIds: string[]; } ) {
		this.logger.debug( ">> handleMembersAddedEvent()" );
		this.logger.debug( "Data: %o", data );

		const addedMembers = await this.prismaService.member.findMany( {
			where: { id: { in: data.memberIds } }
		} );

		const subject = `Welcome to ${ data.name } Team`;
		const content = `You have been added to a new team under ${ data.department }`;

		await Promise.all( addedMembers.map( () => {
			this.logger.debug( "Need to send mail here!" );
			this.logger.debug( `Subject: ${ subject }` );
			this.logger.debug( `Content: ${ content }` );
		} ) );
	}
}
