import type { UserAuthInfo } from "@api/common";
import { LoggerFactory, PrismaService } from "@api/common";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Department, Member, Position, Task, Team } from "@prisma/client";
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

	async getTasksCreated( createdById: string ): Promise<Task[]> {
		this.logger.debug( ">> getTasksCreated()" );
		this.logger.debug( "Data: %o", createdById );

		const member = await this.prismaService.member.findUnique( {
			where: { id: createdById },
			include: { tasksCreated: true }
		} );

		if ( !member ) {
			this.logger.debug( "Member Not Found! Id: %s", createdById );
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTasksCreated()" );
		return member.tasksCreated;
	}

	async getTasksAssigned( assigneeId: string ): Promise<Task[]> {
		this.logger.debug( ">> getTasksAssigned()" );
		this.logger.debug( "Data: %o", assigneeId );

		const member = await this.prismaService.member.findUnique( {
			where: { id: assigneeId },
			include: { tasksAssigned: true }
		} );

		if ( !member ) {
			this.logger.debug( "Member Not Found! Id: %s", assigneeId );
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTasksAssigned()" );
		return member.tasksAssigned;
	}

	async getDepartmentCores( department: Department ): Promise<Member[]> {
		this.logger.debug( ">> getDepartmentCores()" );
		this.logger.debug( "Data: %o", department );

		const cores = await this.prismaService.member.findMany( {
			where: { department, position: Position.CORE }
		} );

		this.logger.debug( "<< getDepartmentCores()" );
		return cores;
	}

	async getTeamsPartOf( memberId: string ): Promise<Team[]> {
		this.logger.debug( ">> getTeamsPartOf()" );
		this.logger.debug( "Data: %o", memberId );

		const member = await this.prismaService.member.findUnique( {
			where: { id: memberId },
			include: { teams: true }
		} );

		if ( !member ) {
			this.logger.debug( "Member Not Found! Id: %s", memberId );
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTeamsPartOf()" );
		return member.teams;
	}

	async getMembers( memberIds: string[] ): Promise<Member[]> {
		this.logger.debug( ">> getMembers()" );
		this.logger.debug( "Data: %o", memberIds );

		const members = await this.prismaService.member.findMany( {
			where: { id: { in: memberIds } }
		} );

		this.logger.debug( "<< getMembers()" );
		return members;
	}

	async getAuthenticatedMember( authInfo: UserAuthInfo ): Promise<Member> {
		this.logger.debug( ">> getAuthenticatedUser()" );
		this.logger.debug( "Data: %o", authInfo );

		const member = await this.prismaService.member.findUnique( { where: { id: authInfo.id } } );
		if ( !member ) {
			this.logger.error( "Member Not Found! Id: %s", authInfo.id );
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}

		this.logger.debug( "Member Found! Id: %s", member.id );
		this.logger.debug( "<< getAuthenticatedMember()" );
		return member;
	}

	async createMember( { password, ...data }: CreateMemberInput ): Promise<Member> {
		this.logger.debug( ">> createMember()" );
		this.logger.debug( "Data: %o", data );

		const existingMember = await this.prismaService.member.findFirst( {
			where: {
				OR: {
					email: data.email,
					rollNumber: data.rollNumber
				}
			}
		} );

		if ( !!existingMember ) {
			this.logger.debug( "Member with RollNumber/Email Already Exists! RollNumber: %s", data.rollNumber );
			throw new ConflictException( MemberMessages.ALREADY_EXISTS );
		}

		const member = await this.prismaService.member.create( {
			data: { ...data, position: Position.COORD }
		} );

		this.eventEmitter.emit( MemberEvents.CREATED, { ...member, password } );
		this.logger.debug( "Member Created Successfully! Id: %s", member.id );

		this.logger.debug( "<< createMember()" );
		return member;
	}

	async enableMember( data: EnableMemberInput ) {
		this.logger.debug( ">> enableMember()" );
		this.logger.debug( "Data: %o", data );

		let member = await this.prismaService.member.findUnique( { where: { id: data.id } } );
		if ( !member ) {
			this.logger.debug( "Member Not Found! Id: %s", data.id );
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}

		member = await this.prismaService.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		this.eventEmitter.emit( MemberEvents.ENABLED, member );
		this.logger.debug( "Member Enabled Successfully! Id: %s", member.id );
		this.logger.debug( "<< enableMember()" );
		return member;
	}
}
