import type { UserAuthInfo } from "@api/common";
import { LoggerFactory, PrismaExceptionCode, PrismaService } from "@api/common";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { Department } from "@prisma/client";
import { TeamMessages } from "../constants";
import { TeamEvents } from "../events";
import type { AddTeamMembersInput, CreateTeamInput } from "../inputs";

@Injectable()
export class TeamService {
	private readonly logger = LoggerFactory.getLogger( TeamService );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) { }

	async getTeamCreator( teamId: string ) {
		return this.prismaService.team
			.findUniqueOrThrow( { where: { id: teamId } } )
			.createdBy()
			.catch( this.prismaService.handleException( {
				code: PrismaExceptionCode.RECORD_NOT_FOUND,
				message: TeamMessages.NOT_FOUND
			} ) );
	}

	async getTeamMembers( teamId: string ) {
		return this.prismaService.team
			.findUniqueOrThrow( { where: { id: teamId } } )
			.members()
			.catch( this.prismaService.handleException( {
				code: PrismaExceptionCode.RECORD_NOT_FOUND,
				message: TeamMessages.NOT_FOUND
			} ) );
	}

	async getDepartmentTeams( department: Department ) {
		this.logger.debug( ">> getDepartmentTeams()" );
		this.logger.debug( "Department: %s", department );

		const teams = await this.prismaService.team.findMany( { where: { department } } );

		this.logger.debug( "Found Teams: %o", teams );
		return teams;
	}

	async createTeam( data: CreateTeamInput, authInfo: UserAuthInfo ) {
		this.logger.debug( ">> createTeam()" );
		this.logger.debug( "Data: %o", data );

		const team = await this.prismaService.team
			.create( {
				data: {
					...data,
					members: { connect: { id: authInfo.id } },
					createdBy: { connect: { id: authInfo.id } }
				}
			} )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.UNIQUE_CONSTRAINT_FAILED,
					message: TeamMessages.ALREADY_EXISTS
				} )
			);

		this.logger.debug( "Team Created Successfully! Id: %s", team.id );
		return team;
	}

	async addTeamMembers( data: AddTeamMembersInput ) {
		this.logger.debug( ">> addTeamMembers()" );
		this.logger.debug( "Data: %o", data );

		const team = await this.prismaService.team
			.update( {
				where: { id: data.teamId },
				data: {
					members: {
						connect: data.memberIds.map( id => {
							return { id };
						} )
					}
				}
			} )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.UNIQUE_CONSTRAINT_FAILED,
					message: TeamMessages.NOT_FOUND
				} )
			);

		this.eventEmitter.emit( TeamEvents.MEMBERS_ADDED, { ...team, memberIds: data.memberIds } );
		this.logger.debug( "Team Created Successfully! Id: %s", team.id );

		return team;
	}
}
