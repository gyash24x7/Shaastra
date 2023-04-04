import {
	ConflictException,
	HttpException,
	INestApplicationContext,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	Type
} from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { type AppConfig, Config } from "../config";
import { LoggerFactory } from "../logger";
import { prismaLoggingMiddleware } from "./prisma.middleware";

export enum PrismaExceptionCode {
	UNIQUE_CONSTRAINT_FAILED = "P2002",
	RECORD_NOT_FOUND = "P2025",
}

@Injectable()
export class PrismaService extends PrismaClient {
	private readonly logger = LoggerFactory.getLogger( PrismaService );

	private readonly codeExceptionMapping: Record<PrismaExceptionCode, Type<HttpException>> = {
		P2002: ConflictException,
		P2025: NotFoundException
	};

	constructor( @Config() readonly config: AppConfig ) {
		super( {
			datasources: { db: config.db },
			log: [ "query", "info", "warn", "error" ]
		} );
		
		this.$use( prismaLoggingMiddleware( this.logger ) );
	}

	handleException( ...codeMessageMap: Array<{ code: PrismaExceptionCode; message: string; }> ) {
		return ( err: Error ) => {
			if ( err instanceof Prisma.PrismaClientKnownRequestError ) {
				for ( const { code, message } of codeMessageMap ) {
					if ( err.code === code ) {
						this.logger.error( message + " ErrorMeta: %o", err.meta );

						const PrismaException = this.codeExceptionMapping[ err.code ];
						throw new PrismaException( message );
					}
				}
			}

			console.log( err );

			throw new InternalServerErrorException();
		};
	}

	closeApp( app: INestApplicationContext ) {
		return async () => {
			await app.close();
		};
	}

	applyShutdownHooks( app: INestApplicationContext ) {
		this.$on( "beforeExit", this.closeApp( app ) );
	}
}
