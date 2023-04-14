import type { UserAuthInfo } from "@api/common";
import { LoggerFactory, PrismaService } from "@api/common";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
		this.logger.debug( ">> getTeamCreator()" );
		this.logger.debug( "TeamId: %s", teamId );

		const team = await this.prismaService.team.findUnique( {
			where: { id: teamId },
			include: { createdBy: true }
		} );

		if ( !team ) {
			this.logger.error( "Team Not Found! Id: %s", teamId );
			throw new NotFoundException( TeamMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTeamCreator()" );
		return team.createdBy;
	}

	async getTeamMembers( teamId: string ) {
		this.logger.debug( ">> getTeamMembers()" );
		this.logger.debug( "TeamId: %s", teamId );

		const team = await this.prismaService.team.findUnique( {
			where: { id: teamId },
			include: { members: true }
		} );

		if ( !team ) {
			this.logger.error( "Team Not Found! Id: %s", teamId );
			throw new NotFoundException( TeamMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTeamMembers()" );
		return team.members;
	}

	async getDepartmentTeams( department: Department ) {
		this.logger.debug( ">> getDepartmentTeams()" );
		this.logger.debug( "Department: %s", department );

		const teams = await this.prismaService.team.findMany( { where: { department } } );

		this.logger.debug( "<< getDepartmentTeams()" );
		return teams;
	}

	async createTeam( data: CreateTeamInput, authInfo: UserAuthInfo ) {
		this.logger.debug( ">> createTeam()" );
		this.logger.debug( "Data: %o", data );

		const existingTeam = await this.prismaService.team.findUnique( {
			where: { name: data.name }
		} );

		if ( !!existingTeam ) {
			this.logger.error( "Team with same name already exists! Name: %s", data.name );
			throw new ConflictException( TeamMessages.ALREADY_EXISTS );
		}

		const team = await this.prismaService.team.create( {
			data: {
				...data,
				members: { connect: { id: authInfo.id } },
				createdBy: { connect: { id: authInfo.id } }
			}
		} );

		this.logger.debug( "<< createTeam()" );
		return team;
	}

	async addTeamMembers( data: AddTeamMembersInput ) {
		this.logger.debug( ">> addTeamMembers()" );
		this.logger.debug( "Data: %o", data );

		const existingTeam = await this.prismaService.team.findUnique( {
			where: { id: data.teamId }
		} );

		if ( !existingTeam ) {
			this.logger.error( "Team Not Found! TeamId: %s", data.teamId );
			throw new NotFoundException( TeamMessages.NOT_FOUND );
		}

		const team = await this.prismaService.team.update( {
			where: { id: data.teamId },
			data: {
				members: {
					connect: data.memberIds.map( id => {
						return { id };
					} )
				}
			}
		} );

		this.eventEmitter.emit( TeamEvents.MEMBERS_ADDED, { ...team, memberIds: data.memberIds } );
		this.logger.debug( "<< addTeamMembers()" );
		return team;
	}
}
