import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import type { CreateUserInput } from "../../dtos/user.dtos";
import { UserMessages } from "../../constants/user.messages";
import { PrismaService } from "../../services/prisma.service";

export class CreateUserCommand implements ICommand {
	constructor( public readonly data: CreateUserInput ) {}
}

@CommandHandler( CreateUserCommand )
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, boolean> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateUserCommand ): Promise<boolean> {
		const existingUser = await this.prismaService.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			throw new ConflictException( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await this.prismaService.user.create( { data } );
		return true;
	}
}