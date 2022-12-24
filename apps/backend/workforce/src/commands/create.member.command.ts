import { AppEvents } from "../events/index.js";
import type { CreateMemberInput } from "../graphql/inputs.js";
import { MemberMessages } from "../messages/member.messages.js";
import got from "got";
import type { AppContext } from "../index.js";

export default async function createMemberCommandHandler( _data: unknown, context: AppContext ) {
	const { password, ...data } = _data as CreateMemberInput;
	const services = await context.consul.getRegisteredServices( context.appInfo.id );
	const { Address, Port } = services.find( service => service.ID === "identity" )!;
	const url = `http://${ Address }:${ Port }/api/users`;
	const input = {
		name: data.name,
		email: data.email,
		password,
		username: data.rollNumber,
		roles: [ `MEMBER_${ data.department }`, `POSITION_${ data.position }` ]
	};

	const response: any = await got.post( url, { json: input } ).json();

	context.logger.log( `Response: ${ response }` );

	const existingMember = await context.prisma.member.findUnique( {
		where: { id: response.data }
	} );

	if ( existingMember ) {
		throw new Error( MemberMessages.ALREADY_EXISTS );
	}

	const member = await context.prisma.member.create( { data: { ...data, id: response.data as string } } );
	context.eventBus.execute( AppEvents.MEMBER_CREATED_EVENT, member, context );
	return member.id;
}