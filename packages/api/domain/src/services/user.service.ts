import { JwtService, LoggerFactory, PrismaExceptionCode, PrismaService } from "@api/common";
import { BadRequestException, Injectable } from "@nestjs/common";
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

		data.password = await bcrypt.hash( data.password, 10 );
		const user = await this.prismaService.user
			.create( { data } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.UNIQUE_CONSTRAINT_FAILED,
					message: UserMessages.ALREADY_EXISTS
				} )
			);

		this.eventEmitter.emit( UserEvents.CREATED, user );
		this.logger.debug( "User Created! Username: %s", user.username );
		return user;
	}

	async login( { username, password }: LoginInput ) {
		this.logger.debug( ">> login()" );
		this.logger.debug( "Data: %o", { username, password } );

		const user = await this.prismaService.user
			.findUniqueOrThrow( { where: { username } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: UserMessages.NOT_FOUND
				} )
			);

		if ( !user.verified ) {
			this.logger.error( UserMessages.NOT_VERIFIED + " Username: %s", username );
			throw new BadRequestException( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( password, user.password );
		if ( !doPasswordsMatch ) {
			this.logger.debug( UserMessages.INVALID_CREDENTIALS + " Username: %s", username );
			throw new BadRequestException( UserMessages.INVALID_CREDENTIALS );
		}

		const token = this.jwtService.sign( { id: user.id, verified: user.verified, roles: user.roles } );
		return { user, token };
	}

	async verifyUser( { userId, hash }: VerifyUserInput ) {
		this.logger.debug( ">> verifyUser()" );
		this.logger.debug( "Data: %o", { userId, hash } );

		await this.prismaService.user
			.findUniqueOrThrow( { where: { id: userId } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: UserMessages.NOT_FOUND
				} )
			);

		const token = await this.prismaService.token
			.findFirstOrThrow( { where: { userId, hash } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TokenMessages.NOT_FOUND
				} )
			);

		if ( dayjs().isAfter( token.expiry ) ) {
			this.logger.error( TokenMessages.EXPIRED + " TokenId: %s", token.id );
			throw new BadRequestException( TokenMessages.EXPIRED );
		}

		const updatedUser = await this.prismaService.user.update( {
			where: { id: userId },
			data: { verified: true }
		} );

		await this.prismaService.token.delete( { where: { id: token.id } } );

		return updatedUser;
	}
}
