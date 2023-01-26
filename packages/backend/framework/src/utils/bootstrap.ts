import type { INestApplication, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { RedisOptions, Transport } from "@nestjs/microservices";
import bodyParser from "body-parser";
import { LoggerFactory, loggerMiddleware } from "../logger/index.js";

export interface WithShutdownHook {
	applyShutdownHooks: ( app: INestApplication ) => void;
}

export async function bootstrap<P extends WithShutdownHook = any>( AppModule: any, PrismaService?: Type<P> ) {
	const logger = LoggerFactory.getLogger( "Bootstrap" );
	const app = await NestFactory.create( AppModule, { logger } );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const appName = configService.getOrThrow<string>( "app.name" );
	const url = configService.getOrThrow<string>( "app.url" );
	const id = configService.getOrThrow<string>( "app.id" );

	if ( id === "gateway" ) {
		app.enableCors( {
			origin: "http://localhost:3000",
			credentials: true
		} );
	}

	app.use( bodyParser.json() );
	app.use( loggerMiddleware() );

	app.connectMicroservice<RedisOptions>( {
		transport: Transport.REDIS,
		options: {
			host: configService.getOrThrow( "app.redis.host" ),
			port: configService.getOrThrow( "app.redis.port" )
		}
	} );

	if ( PrismaService ) {
		app.get( PrismaService ).applyShutdownHooks( app );
	}

	await app.startAllMicroservices();
	await app.listen( port );

	logger.info( `${ appName } started on ${ url }!` );
}