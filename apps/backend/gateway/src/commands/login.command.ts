import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service.js";
import { UserMessages } from "../constants/messages.js";
import { JwtService, LoggerFactory } from "@shaastra/framework";
import type { User } from "@prisma/client/identity/index.js";

export class LoginInput {
	username: string;
	password: string;
}

export type LoginCommandResponse = { user: User, token: string };

export class LoginCommand implements ICommand {
	constructor( public readonly data: LoginInput ) {}
}

@CommandHandler( LoginCommand )
export class LoginCommandHandler implements ICommandHandler<LoginCommand, LoginCommandResponse> {
	private readonly logger = LoggerFactory.getLogger( LoginCommandHandler );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: LoginCommand ): Promise<LoginCommandResponse> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", data );

		const user = await this.prismaService.user.findUnique( {
			where: { username: data.username }
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

		const token = await this.jwtService.sign( { id: user.id, verified: user.verified, roles: user.roles } );
		return { user, token };
	}
}