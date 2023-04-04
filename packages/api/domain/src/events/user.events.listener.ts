import { LoggerFactory } from "@api/common";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { User } from "@prisma/client";
import { TokenService } from "../services";

export class UserEvents {
	public static readonly CREATED = "user.created";
}

@Injectable()
export class UserEventsListener {
	private readonly logger = LoggerFactory.getLogger( UserEventsListener );

	constructor( private readonly tokenService: TokenService ) { }

	@OnEvent( UserEvents.CREATED )
	async handleUserCreatedEvent( data: User ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		const token = await this.tokenService.createToken( data.id );
		const link = `http://localhost:9000/api/auth/verify-email/${ data.id }/${ token.hash }`;
		const subject = "Verify your Shaastra Account";
		const content = `Please click here to verify your Shaastra Account ${ link }`;

		this.logger.debug( "Need to send mail here!" );
		this.logger.debug( `Subject: ${ subject }` );
		this.logger.debug( `Content: ${ content }` );
	}
}
