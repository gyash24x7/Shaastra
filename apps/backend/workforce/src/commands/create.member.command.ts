import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { MemberCreatedEvent } from "../events/index.js";
import type { CreateMemberInput } from "../graphql/inputs.js";
import { MemberMessages } from "../messages/member.messages.js";


export class CreateMemberCommand implements ICommand<CreateMemberInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: CreateMemberInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateMemberCommand, string> = async ( { data, context } ) => {
		const services = await context.consul.getRegisteredServices( context.config.id );
		const { Address, Port } = services.find( service => service.ID === "identity" )!;
		const url = `http://${ Address }:${ Port }/api/users`;
		const input = {
			name: data.name,
			email: data.email,
			password: data.password,
			username: data.rollNumber,
			roles: [ `MEMBER_${ data.department }`, `POSITION_${ data.position }` ]
		};
		const response: any = { url, input };
		context.logger.log( `Response: ${ response }` );

		const existingMember = await context.prisma.member.findUnique( {
			where: { id: response.data }
		} );

		if ( existingMember ) {
			throw new Error( MemberMessages.ALREADY_EXISTS );
		}

		const member = await context.prisma.member.create( { data: { ...data, id: response.data } } );
		context.eventBus.publish( new MemberCreatedEvent( member, context ) );
		return member.id;
	};
}
