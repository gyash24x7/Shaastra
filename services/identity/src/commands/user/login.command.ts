import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import type { AuthResponsePayload, LoginInput } from "../../dtos/user.dtos";
import { UserMessages } from "../../constants/user.messages";
import { PrismaService } from "../../services/prisma.service";

export class LoginCommand implements ICommand {
	constructor( public readonly data: LoginInput ) {}
}

@CommandHandler( LoginCommand )
export class LoginCommandHandler implements ICommandHandler<LoginCommand, AuthResponsePayload> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: LoginCommand ): Promise<AuthResponsePayload> {
		const user = await this.prismaService.user.findUnique( { where: { username: data.username } } );

		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		const doPasswordsMatch = await bcrypt.compare( data.password, user.password );
		if ( !doPasswordsMatch ) {
			throw new BadRequestException( UserMessages.INVALID_CREDENTIALS );
		}

		const token = await this.jwtService.signAsync( user );
		return { user, token };
	}
}