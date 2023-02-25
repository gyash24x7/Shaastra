import { JwtService } from "@app/framework/auth";
import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import bcrypt from "bcryptjs";
import type { PrismaClient, User } from "../../prisma/generated";
import { UserMessages } from "../constants";

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
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: LoginCommand ): Promise<LoginCommandResponse> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", data );

		const user = await this.prismaService.client.user.findUnique( {
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