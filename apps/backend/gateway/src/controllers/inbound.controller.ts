import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern } from "@nestjs/microservices";
import { LoggerFactory } from "@shaastra/framework";
import { CreateUserCommand } from "../commands/create.user.command.js";
import { InboundEvents } from "../constants/inbound.events.js";

export type MemberCreatedInboundData = {
	id: string
	name: string
	email: string
	rollNumber: string
	department: string
	position: string
	password: string
}

@Controller()
export class InboundController {
	private readonly logger = LoggerFactory.getLogger( InboundController );

	constructor(
		private readonly commandBus: CommandBus ) {}

	@EventPattern( InboundEvents.MEMBER_CREATED )
	async handleMemberCreatedEvent( data: MemberCreatedInboundData ) {
		this.logger.debug( ">> handleMemberCreatedEvent()" );
		this.logger.debug( "Data: %o", data );

		return this.commandBus.execute(
			new CreateUserCommand( {
				id: data.id,
				email: data.email,
				name: data.name,
				password: data.password,
				username: data.rollNumber,
				roles: [ `MEMBER_${ data.department }`, `POSITION_${ data.position }` ]
			} )
		);
	}

}