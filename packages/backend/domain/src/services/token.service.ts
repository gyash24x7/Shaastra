import { LoggerFactory, PrismaService } from "@api/common";
import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import dayjs from "dayjs";

@Injectable()
export class TokenService {
	private readonly logger = LoggerFactory.getLogger( TokenService );

	constructor( private readonly prismaService: PrismaService ) { }

	async createToken( userId: string ) {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		const hash = crypto.randomBytes( 32 ).toString( "hex" );
		const expiry = dayjs().add( 2, "days" ).toDate();
		return this.prismaService.token.create( { data: { userId, hash, expiry } } );
	}
}
