import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./user.commands";
import { LoginResponsePayload } from "./user.dtos";
import { IdentityPrismaService } from "@shaastra/prisma";
import { NotFoundException } from "@nestjs/common";
import { UserMessages } from "./user.messages";

@CommandHandler( LoginCommand )
export class LoginCommandHandler implements ICommandHandler<LoginCommand, LoginResponsePayload> {
	constructor( private readonly prismaService: IdentityPrismaService ) {}

	async execute( { data }: LoginCommand ) {
		const user = await this.prismaService.user.findUnique( { where: { email: data.username } } );

		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		return new LoginResponsePayload();
	}

}

export const commandHandlers = [ LoginCommandHandler ];