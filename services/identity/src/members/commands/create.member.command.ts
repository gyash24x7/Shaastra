import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException } from "@nestjs/common";
import { MemberMessages } from "../member.messages";
import { MemberCreatedEvent } from "../events/member.created.event";
import { PrismaService } from "../../prisma/prisma.service";
import type { Department, MemberPosition } from "@prisma/client/identity";

export type CreateMemberInput = {
	userId: string
	department: Department;
	position: MemberPosition;
	mobile: string;
}

export class CreateMemberCommand implements ICommand {
	constructor( public readonly data: CreateMemberInput ) {}
}

@CommandHandler( CreateMemberCommand )
export class CreateMemberCommandHandler implements ICommandHandler<CreateMemberCommand, boolean> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateMemberCommand ): Promise<boolean> {
		const existingMember = await this.prismaService.member.findUnique( {
			where: { userId: data.userId }
		} );

		if ( existingMember ) {
			throw new ConflictException( MemberMessages.ALREADY_EXISTS );
		}

		const member = await this.prismaService.member.create( { data, include: { user: true } } );
		this.eventBus.publish( new MemberCreatedEvent( member ) );
		return true;
	}
}