import { AppEvents } from "../events/index.js";
import type { CreateMemberInput } from "../graphql/inputs.js";
import { MemberMessages } from "../messages/member.messages.js";
import got from "got";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export default async function createMemberCommandHandler( _data: unknown, context: ServiceContext ) {
	const { password, ...data } = _data as CreateMemberInput;

	logger.debug( `Handling ${ AppCommands.CREATE_MEMBER_COMMAND }...` );
	logger.debug( "Data: ", data );

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

	const response = await got.post( url, { json: input } ).text();

	logger.debug( `Response: ${ response }` );

	const existingMember = await prisma.member.findUnique( {
		where: { id: response }
	} );

	if ( existingMember ) {
		logger.error( `Member with Id ${ response } already exists!` );
		throw new Error( MemberMessages.ALREADY_EXISTS );
	}

	const member = await prisma.member.create( { data: { ...data, id: response } } );
	logger.debug( `Member Created Successfully! ${ response }` );

	context.eventBus.execute( AppEvents.MEMBER_CREATED_EVENT, member, context );
	return member.id;
}