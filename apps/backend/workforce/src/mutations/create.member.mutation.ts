import { AppEvents } from "../events/index.js";
import { MemberMessages } from "../messages/member.messages.js";
import superagent from "superagent";
import { consul, eventBus, logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { Department, MemberPosition } from "@prisma/client/workforce/index.js";
import { builder } from "../schema/builder.js";
import { memberRef } from "../entities/index.js";

const createMemberInputRef = builder.inputType( "CreateMemberInput", {
	fields: t => ( {
		name: t.string( { required: true } ),
		email: t.string( { required: true } ),
		password: t.string( { required: true } ),
		rollNumber: t.string( { required: true } ),
		department: t.field( { type: Department, required: true } ),
		mobile: t.string( { required: true } )
	} )
} );

builder.mutationField( "createMember", t => t.prismaField( {
	type: memberRef,
	args: {
		data: t.arg( { type: createMemberInputRef, required: true } )
	},
	async resolve( _query, _parent, { data }, context, _info ) {
		logger.trace( `>> Resolvers::Mutation::createMember()` );
		logger.debug( "Data: %o", data );

		const services = await consul.getRegisteredServices();
		const { Address, Port } = services.find( service => service.ID === "identity" )!;
		const url = `http://${ Address }:${ Port }/api/users`;
		const input = {
			name: data.name,
			email: data.email,
			password: data.password,
			username: data.rollNumber.toLowerCase(),
			roles: [ `MEMBER_${ data.department }`, `POSITION_${ MemberPosition.COORD }` ]
		};

		const response = await superagent.post( url ).send( input );

		logger.debug( "Response Body: %o", response.body );

		const existingMember = await prisma.member.findUnique( {
			where: { id: response.body }
		} );

		if ( existingMember ) {
			logger.error( `Member with Id ${ response } already exists!` );
			throw new Error( MemberMessages.ALREADY_EXISTS );
		}

		const member = await prisma.member.create( {
			data: {
				...data,
				id: response.body,
				position: MemberPosition.COORD
			}
		} );
		logger.debug( `Member Created Successfully! ${ response }` );

		eventBus.execute( AppEvents.MEMBER_CREATED_EVENT, member, context );
		return member;
	}
} ) );
