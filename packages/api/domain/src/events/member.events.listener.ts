import { LoggerFactory } from "@api/common";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { Member } from "@prisma/client";
import { MemberService, UserService } from "../services";

export class MemberEvents {
	public static readonly CREATED = "member.created";
	public static readonly ENABLED = "member.enabled";
}

@Injectable()
export class MemberEventsListener {
	private readonly logger = LoggerFactory.getLogger( MemberEventsListener );

	constructor(
		private readonly memberService: MemberService,
		private readonly userService: UserService
	) { }

	@OnEvent( MemberEvents.CREATED )
	async handleMemberCreatedEvent( data: Member & { password: string; } ) {
		this.logger.debug( ">> handleMemberCreatedEvent()" );
		this.logger.debug( "Data: %o", data );

		await this.userService.createUser( {
			id: data.id,
			name: data.name,
			email: data.email,
			password: data.password,
			username: data.rollNumber,
			roles: [ `MEMBER_${ data.department }`, `POSITION_${ data.position }` ]
		} );

		const departmentCores = await this.memberService.getDepartmentCores( data.department );

		departmentCores.forEach( member => {
			const subject = `New Member requested to join ${ data.department }`;
			const content = "Please log in to Shaastra Prime and approve this request.";
			// await this.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
			this.logger.debug( "Need to send mail here!" );
			this.logger.debug( `Subject: ${ subject }` );
			this.logger.debug( `Content: ${ content }` );
			this.logger.debug( `Member: ${ member?.name }` );
		} );
	}

	@OnEvent( MemberEvents.ENABLED )
	async handleMemberEnabledEvent( data: Member ) {
		this.logger.debug( ">> handleMemberEnabledEvent()" );
		this.logger.debug( "Data: %o", data );

		const subject = "Your Shaastra Prime Account is Enabled";
		const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
		this.logger.debug( "Need to send mail here!" );
		this.logger.debug( `Subject: ${ subject }` );
		this.logger.debug( `Content: ${ content }` );
	}
}
