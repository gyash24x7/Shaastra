import type { UserAuthInfo } from "@api/common";
import { LoggerFactory, PrismaExceptionCode, PrismaService } from "@api/common";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MemberPosition } from "@prisma/client";
import { MemberMessages } from "../constants";
import { MemberEvents } from "../events";
import type { CreateMemberInput, EnableMemberInput } from "../inputs";

@Injectable()
export class MemberService {
	private readonly logger = LoggerFactory.getLogger( MemberService );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) { }

	async getTeamsPartOf( memberId: string ) {
		return this.prismaService.member
			.findUniqueOrThrow( { where: { id: memberId } } )
			.teams()
			.catch( this.prismaService.handleException( {
				code: PrismaExceptionCode.RECORD_NOT_FOUND,
				message: MemberMessages.NOT_FOUND
			} ) );
	}

	async getAuthenticatedMember( authInfo: UserAuthInfo ) {
		this.logger.debug( ">> getAuthenticatedUser()" );
		this.logger.debug( "Data: %o", authInfo );

		const member = await this.prismaService.member
			.findUniqueOrThrow( { where: { id: authInfo.id } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: MemberMessages.NOT_FOUND
				} )
			);

		this.logger.debug( "Member Found! Id: %s", member.id );
		return member;
	}

	async createMember( { password, ...data }: CreateMemberInput ) {
		this.logger.debug( ">> createMember()" );
		this.logger.debug( "Data: %o", data );

		const member = await this.prismaService.member
			.create( { data: { ...data, position: MemberPosition.COORD } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.UNIQUE_CONSTRAINT_FAILED,
					message: MemberMessages.ALREADY_EXISTS
				} )
			);

		this.eventEmitter.emit( MemberEvents.CREATED, { ...member, password } );
		this.logger.debug( "Member Created Successfully! Id: %s", member.id );

		return member;
	}

	async enableMember( data: EnableMemberInput ) {
		this.logger.debug( ">> enableMember()" );
		this.logger.debug( "Data: %o", data );

		const member = await this.prismaService.member
			.update( {
				where: { id: data.id },
				data: { enabled: true }
			} )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: MemberMessages.NOT_FOUND
				} )
			);

		this.eventEmitter.emit( MemberEvents.ENABLED, member );
		this.logger.debug( "Member Enabled Successfully! Id: %s", member.id );

		return member;
	}
}
