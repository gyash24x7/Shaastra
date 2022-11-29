import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException, Logger } from "@nestjs/common";
import { MemberMessages } from "../messages/member.messages";
import { MemberCreatedEvent } from "../events/member.created.event";
import { Department, MemberPosition, PrismaService } from "../prisma";
import { HttpService } from "@nestjs/axios";
import { ConsulService } from "@shaastra/consul";
import { catchError, firstValueFrom } from "rxjs";
import type { AxiosError } from "@nestjs/terminus/dist/errors/axios.error";
import { Field, InputType } from "@nestjs/graphql";

@InputType( CreateMemberInput.TYPENAME )
export class CreateMemberInput {
	public static readonly TYPENAME = CreateMemberInput.name;
	@Field() name: string;
	@Field() email: string;
	@Field() password: string;
	@Field() rollNumber: string;
	@Field( () => Department ) department: Department;
	@Field( () => MemberPosition ) position: MemberPosition;
	@Field() mobile: string;
}

export class CreateMemberCommand implements ICommand {
	constructor( public readonly data: CreateMemberInput ) {}
}

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

@CommandHandler( CreateMemberCommand )
export class CreateMemberCommandHandler implements ICommandHandler<CreateMemberCommand, string> {
	private readonly logger = new Logger();

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus,
		private readonly httpService: HttpService,
		private readonly consulService: ConsulService
	) {}

	async createUser( data: CreateUserInput ): Promise<string> {
		const services = await this.consulService.getAllServices();
		const { Address, Port } = Object.values( services ).find( service => service.ID === "identity" )!;
		const url = `http://${ Address }:${ Port }/api/users`;
		const response = await firstValueFrom(
			this.httpService.post<string>( url, data ).pipe(
				catchError( ( error: AxiosError ) => {
					this.logger.error( error.response.data );
					throw "An error happened!";
				} )
			)
		);
		this.logger.log( `Response: ${ response }` );
		return response.data;
	}

	async execute( { data: { password, ...data } }: CreateMemberCommand ): Promise<string> {
		// Create User By Calling the API and get the user id
		const userId = await this.createUser( {
			name: data.name,
			email: data.email,
			password,
			username: data.rollNumber,
			roles: [ `MEMBER_${ data.department }`, `POSITION_${ data.position }` ]
		} );

		const existingMember = await this.prismaService.member.findUnique( {
			where: { id: userId }
		} );

		if ( existingMember ) {
			throw new ConflictException( MemberMessages.ALREADY_EXISTS );
		}

		const member = await this.prismaService.member.create( { data: { ...data, id: userId } } );
		this.eventBus.publish( new MemberCreatedEvent( member ) );
		return member.id;
	}
}