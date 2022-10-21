import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { UserMessages } from "../user.messages";
import { IdentityPrismaService } from "../../app/identity.prisma.service";

export type LoginInput = {
	username: string;
	password: string;
}

export class LoginCommand implements ICommand {
	constructor( public readonly data: LoginInput ) {}
}

@CommandHandler( LoginCommand )
export class LoginCommandHandler implements ICommandHandler<LoginCommand, string> {
	constructor(
		private readonly prismaService: IdentityPrismaService,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: LoginCommand ): Promise<string> {
		const user = await this.prismaService.user.findUnique( {
			where: { username: data.username },
			include: { roles: true }
		} );

		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		if ( !user.verified ) {
			throw new BadRequestException( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( data.password, user.password );
		if ( !doPasswordsMatch ) {
			throw new BadRequestException( UserMessages.INVALID_CREDENTIALS );
		}

		return this.jwtService.signAsync( {
			sub: user.id,
			roles: user.roles,
			verified: user.verified
		} );
	}
}