import { JwtService, LoggerFactory, PrismaService } from "@api/common";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { TokenMessages, UserMessages } from "../constants";
import { UserEvents } from "../events";
import type { CreateUserInput, LoginInput, VerifyUserInput } from "../inputs";

@Injectable()
export class UserService {
	private readonly logger = LoggerFactory.getLogger( UserService );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly eventEmitter: EventEmitter2
	) { }

	async createUser( data: CreateUserInput ) {
		this.logger.debug( ">> createUser()" );
		this.logger.debug( "Data: %o", data );

		const existingUser = await this.prismaService.user.findFirst( {
			where: {
				OR: {
					email: data.email,
					username: data.username
				}
			}
		} );

		if ( !!existingUser ) {
			this.logger.error( "User with same email/username already exists! Email: %s", data.email );
			throw new ConflictException( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );
		const user = await this.prismaService.user.create( { data } );

		this.eventEmitter.emit( UserEvents.CREATED, user );
		this.logger.debug( "<< createUser()" );
		return user;
	}

	async login( { username, password }: LoginInput ) {
		this.logger.debug( ">> login()" );
		this.logger.debug( "Data: %o", { username, password } );

		const user = await this.prismaService.user.findUnique( { where: { username } } );

		if ( !user ) {
			this.logger.error( "User Not Found! Username: %s", username );
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		if ( !user.verified ) {
			this.logger.error( UserMessages.NOT_VERIFIED + " Username: %s", username );
			throw new BadRequestException( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( password, user.password );
		if ( !doPasswordsMatch ) {
			this.logger.debug( UserMessages.INVALID_CREDENTIALS + " Username: %s", username );
			throw new BadRequestException( UserMessages.INVALID_CREDENTIALS );
		}

		const token = await this.jwtService.sign( { id: user.id, verified: user.verified, roles: user.roles } );
		this.logger.debug( "<< login()" );
		return { user, token };
	}

	async verifyUser( { userId, hash }: VerifyUserInput ) {
		this.logger.debug( ">> verifyUser()" );
		this.logger.debug( "Data: %o", { userId, hash } );

		const user = await this.prismaService.user.findUnique( { where: { id: userId } } );
		if ( !user ) {
			this.logger.error( "User Not Found! Id: %s", userId );
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		const token = await this.prismaService.token.findFirst( { where: { userId, hash } } );
		if ( !token ) {
			this.logger.error( "Token Not Found! UserId: %s", userId );
			throw new NotFoundException( TokenMessages.NOT_FOUND );
		}

		if ( dayjs().isAfter( token.expiry ) ) {
			this.logger.error( TokenMessages.EXPIRED + " TokenId: %s", token.id );
			throw new BadRequestException( TokenMessages.EXPIRED );
		}

		await this.prismaService.token.delete( { where: { id: token.id } } );

		const updatedUser = await this.prismaService.user.update( {
			where: { id: userId },
			data: { verified: true }
		} );

		this.logger.debug( "User Updated! Username: %s", updatedUser.username );
		return updatedUser;
	}
}
