import { ConflictException } from "@nestjs/common";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { PrismaClient } from "@prisma/client/workforce/index.js";
import { Department, type Member, MemberPosition } from "@prisma/client/workforce/index.js";
import { LoggerFactory, PrismaService, Prisma } from "@shaastra/framework";
import { MemberMessages } from "../constants/messages.js";
import { MemberCreatedEvent } from "../events/member.created.event.js";

export type CreateMemberInput = {
	name: string;
	email: string;
	rollNumber: string;
	department: Department;
	mobile: string;
	password: string;
}

export class CreateMemberCommand implements ICommand {
	constructor( public readonly data: CreateMemberInput ) {}
}

@CommandHandler( CreateMemberCommand )
export class CreateMemberCommandHandler implements ICommandHandler<CreateMemberCommand, Member> {
	private readonly logger = LoggerFactory.getLogger( CreateMemberCommandHandler );

	constructor(
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data: { password, ...data } }: CreateMemberCommand ): Promise<Member> {
		this.logger.debug( `>> createMember()` );
		this.logger.debug( "Data: %o", data );

		const existingMember = await this.prismaService.client.member.findFirst( {
			where: {
				OR: {
					rollNumber: data.rollNumber,
					email: data.email
				}
			}
		} );

		if ( !!existingMember ) {
			this.logger.error(
				"Member with Email (%s) or RollNumber (%s) already exists!",
				data.email,
				data.rollNumber
			);
			throw new ConflictException( MemberMessages.ALREADY_EXISTS );
		}

		const member = await this.prismaService.client.member.create( {
			data: { ...data, position: MemberPosition.COORD }
		} );

		this.logger.debug( "Member Created Successfully! Id: %s", member.id );

		this.eventBus.publish( new MemberCreatedEvent( { ...member, password } ) );
		return member;
	}

}