import { type AuthInfo, createLogger, type Department } from "@backend/utils";
import type { PrismaClient } from "../generated";
import { Messages } from "./constants.ts";
import type { AddMembersInput, CreateMemberInput, CreateTeamInput, EnableMemberInput } from "./inputs.ts";
import { prisma } from "./prisma.ts";

export class WorkforceService {
	private readonly logger = createLogger( WorkforceService.name );

	constructor( private readonly prisma: PrismaClient ) {}

	async getMember( memberId: string ) {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { memberId } );

		const member = await this.prisma.member.findUnique( {
			where: { id: memberId }
		} );

		if ( !member ) {
			this.logger.error( "Member not found!" );
			throw new Error( Messages.MEMBER_NOT_FOUND );
		}

		this.logger.debug( "Member found: %o", member );

		return member;
	}

	async getMemberTeams( memberId: string ) {
		this.logger.debug( ">> getMemberTeams()" );
		this.logger.debug( "Data: %o", { memberId } );

		const member = await this.prisma.member.findUnique( {
			where: { id: memberId },
			include: { teams: true }
		} );

		if ( !member ) {
			this.logger.error( "Member not found!" );
			throw new Error( Messages.MEMBER_NOT_FOUND );
		}

		this.logger.debug( "<< getMemberTeams()" );
		return member.teams;
	}

	async getDepartmentMembers( department: Department ) {
		this.logger.debug( `>> getTeamMembers()` );
		this.logger.debug( "Data: %o", { department } );

		const members = await this.prisma.member.findMany( { where: { department } } );

		this.logger.debug( `<< getTeamMembers()` );
		return members;
	}

	async createMember( data: CreateMemberInput ) {
		this.logger.debug( `>> createMember()` );
		this.logger.debug( "Data: %o", data );

		const existingMember = await this.prisma.member.findFirst( {
			where: {
				OR: [
					{ id: data.id },
					{ email: data.email },
					{ rollNumber: data.rollNumber }
				]
			}
		} );

		if ( !!existingMember ) {
			this.logger.error(
				"Member with Email (%s) or RollNumber (%s) already exists!",
				data.email,
				data.rollNumber
			);
			throw new Error( Messages.MEMBER_ALREADY_EXISTS );
		}

		const member = await this.prisma.member.create( { data: { ...data } } );

		this.logger.debug( "Member Created Successfully! Id: %s", member.id );
		this.logger.debug( `<< createMember()` );
		return member;
	}

	async enableMember( data: EnableMemberInput, authInfo: AuthInfo ) {
		this.logger.debug( `>> enableMember()` );
		this.logger.debug( "Data: %o", data );

		if ( authInfo.position !== "CORE" ) {
			this.logger.error( "Unauthorized to enable member!" );
			throw new Error( Messages.REQUIRES_CORE_ACCESS );
		}

		const member = await this.prisma.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		this.logger.debug( "Member Enabled Successfully! Id: %s", member.id );
		this.logger.debug( `<< enableMember()` );
		return member;
	}

	async getTeam( teamId: string ) {
		this.logger.debug( `>> getTeam()` );
		this.logger.debug( "Data: %o", { teamId } );

		const team = await this.prisma.team.findUnique( { where: { id: teamId } } );

		if ( !team ) {
			this.logger.error( "Team not found!" );
			throw new Error( Messages.TEAM_NOT_FOUND );
		}

		this.logger.debug( `<< getTeam()` );
		return team;
	}

	async getTeamMembers( teamId: string ) {
		this.logger.debug( `>> getTeamMembers()` );
		this.logger.debug( "Data: %o", { teamId } );

		const team = await this.prisma.team.findUnique( {
			where: { id: teamId },
			include: { members: true }
		} );

		if ( !team ) {
			this.logger.error( "Team not found!" );
			throw new Error( Messages.TEAM_NOT_FOUND );
		}

		this.logger.debug( `<< getTeamMembers()` );
		return team.members;
	}

	async createTeam( data: CreateTeamInput, authInfo: AuthInfo ) {
		this.logger.debug( `>> createTeam()` );
		this.logger.debug( "Data: %o", data );

		const existingTeam = await this.prisma.team.findUnique( { where: { name: data.name } } );

		if ( !!existingTeam ) {
			this.logger.error( "Team already exists with Name %s", data.name );
			throw new Error( Messages.TEAM_ALREADY_EXISTS );
		}

		const team = await this.prisma.team.create( {
			data: {
				...data,
				department: authInfo?.department!,
				members: { connect: { id: authInfo!.id } },
				createdBy: { connect: { id: authInfo!.id } }
			},
			include: { members: true }
		} );

		this.logger.debug( "Team Created Successfully! Id: %s", team.id );
		this.logger.debug( `<< createTeam()` );
		return team;
	}

	async addMembers( data: AddMembersInput, authInfo: AuthInfo ) {
		this.logger.debug( `>> addMembers()` );
		this.logger.debug( "Data: %o", data );

		const team = await this.prisma.team.findUnique( { where: { id: data.teamId } } );

		if ( !team ) {
			this.logger.error( "Team not found with Id %s", data.teamId );
			throw new Error( Messages.TEAM_NOT_FOUND );
		}

		if ( team.department !== authInfo.department ) {
			this.logger.error( "Team does not belong to your Department!" );
			throw new Error( Messages.NOT_YOUR_DEPARTMENT );
		}

		const members = await this.prisma.member.findMany( {
			where: {
				id: { in: data.memberIds },
				department: team.department
			}
		} );

		if ( members.length !== data.memberIds.length ) {
			this.logger.error( "Some Members not found!" );
			throw new Error( Messages.MEMBER_NOT_FOUND );
		}

		const updatedTeam = await this.prisma.team.update( {
			where: { id: data.teamId },
			data: {
				members: {
					connect: data.memberIds.map( ( id ) => {
						return { id };
					} )
				}
			}
		} );

		this.logger.debug( "Members Added Successfully!" );
		this.logger.debug( `<< addMembers()` );
		return updatedTeam;
	}
}

export const workforceService = new WorkforceService( prisma );