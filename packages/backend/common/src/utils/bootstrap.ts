import type { Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { AppConfig, CONFIG_DATA } from "../config";
import { LoggerFactory, loggerMiddleware } from "../logger";
import { PrismaService } from "../prisma";

export async function bootstrap( AppModule: Type ) {
	const logger = LoggerFactory.getLogger( AppModule );
	const app = await NestFactory.create( AppModule, { logger } );

	const config = app.get<AppConfig>( CONFIG_DATA );

	app.enableCors( {
		origin: "http://localhost:3000",
		credentials: true
	} );

	app.setGlobalPrefix( "/api" );
	app.use( bodyParser.json() );
	app.use( cookieParser() );
	app.use( loggerMiddleware() );

	const prismaService = app.get( PrismaService );
	prismaService.applyShutdownHooks( app );

	await app.listen( config.appInfo.port );
	logger.info( `${ config.appInfo.name } started on ${ config.appInfo.url }!` );
}
