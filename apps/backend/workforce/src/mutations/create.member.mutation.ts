import { Department, MemberPosition } from "@prisma/client/workforce";
import superagent from "superagent";
import { eventBus, logger } from "..";
import { memberRef } from "../entities";
import { AppEvents } from "../events";
import { MemberMessages } from "../messages/member.messages";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

const createMemberInputRef = builder.inputType( "CreateMemberInput", {
	fields: t => (
		{
			name: t.string( { required: true } ),
			email: t.string( { required: true } ),
			password: t.string( { required: true } ),
			rollNumber: t.string( { required: true } ),
			department: t.field( { type: Department, required: true } ),
			mobile: t.string( { required: true } )
		}
	)
} );

builder.mutationField( "createMember", t => t.prismaField( {
	type: memberRef,
	args: {
		data: t.arg( { type: createMemberInputRef, required: true } )
	},
	async resolve( _query, _parent, { data: { password, ...data } }, context, _info ) {
		logger.trace( `>> Resolvers::Mutation::createMember()` );
		logger.debug( "Data: %o", data );

		const url = `http://localhost:8000/api/users`;
		const input = {
			name: data.name,
			email: data.email,
			password,
			username: data.rollNumber.toLowerCase(),
			roles: [ `MEMBER_${ data.department }`, `POSITION_${ MemberPosition.COORD }` ]
		};

		const response = await superagent.post( url ).send( input );

		logger.debug( "Response Body: %o", response.body );

		const existingMember = await prisma.member.findUnique( {
			where: { id: response.body.id }
		} );

		if ( existingMember ) {
			logger.error( `Member with Id ${ response } already exists!` );
			throw new Error( MemberMessages.ALREADY_EXISTS );
		}

		const member = await prisma.member.create( {
			data: {
				...data,
				id: response.body.id,
				position: MemberPosition.COORD
			}
		} );
		logger.debug( `Member Created Successfully! ${ response }` );

		eventBus.execute( AppEvents.MEMBER_CREATED_EVENT, member, context );
		return member;
	}
} ) );
