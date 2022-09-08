import { ArgumentsHost, Catch, ContextType, HttpException, HttpServer, HttpStatus, } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client/workforce";
import type { FastifyReply } from "fastify";

export declare type GqlContextType = "graphql" | ContextType;

export type ErrorCodesStatusMapping = {
	[ key: string ]: number;
};

@Catch( Prisma?.PrismaClientKnownRequestError )
export class PrismaClientExceptionFilter extends BaseExceptionFilter {

	private readonly errorCodesStatusMapping: ErrorCodesStatusMapping = {
		P2000: HttpStatus.BAD_REQUEST,
		P2002: HttpStatus.CONFLICT,
		P2025: HttpStatus.NOT_FOUND,
	};

	constructor( applicationRef?: HttpServer, errorCodesStatusMapping?: ErrorCodesStatusMapping ) {
		super( applicationRef );

		if ( errorCodesStatusMapping ) {
			this.errorCodesStatusMapping = Object.assign(
				this.errorCodesStatusMapping,
				errorCodesStatusMapping,
			);
		}
	}

	override catch( exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost ) {
		const statusCode = this.errorCodesStatusMapping[ exception.code ] || HttpStatus.INTERNAL_SERVER_ERROR;
		const message = `[${ exception.code }]: ` + this.exceptionShortMessage( exception.message );
		if ( host.getType() === "http" ) {
			const ctx = host.switchToHttp();
			const response = ctx.getResponse<FastifyReply>();

			if ( !Object.keys( this.errorCodesStatusMapping ).includes( exception.code ) ) {
				return super.catch( exception, host );
			}

			response.status( statusCode ).send( JSON.stringify( { statusCode, message } ) );

		} else if ( host.getType<GqlContextType>() === "graphql" ) {
			if ( !Object.keys( this.errorCodesStatusMapping ).includes( exception.code ) ) {
				return exception;
			}

			return new HttpException( { statusCode, message }, statusCode );
		}
	}

	exceptionShortMessage( message: string ): string {
		const shortMessage = message.substring( message.indexOf( "→" ) );
		return shortMessage.substring( shortMessage.indexOf( "\n" ) ).replace( /\n/g, "" ).trim();
	}
}