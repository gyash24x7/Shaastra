import { NestFactory } from "@nestjs/core";
import { RedisOptions, Transport } from "@nestjs/microservices";
import bodyParser from "body-parser";
import { type AppConfig, CONFIG_DATA } from "../config/index.js";
import { LoggerFactory, loggerMiddleware } from "../logger/index.js";
import { PRISMA_SERVICE, PrismaService } from "../prisma/index.js";

export async function bootstrap( AppModule: any ) {
	const logger = LoggerFactory.getLogger( AppModule );
	const app = await NestFactory.create( AppModule, { logger } );

	const config = app.get<AppConfig>( CONFIG_DATA );

	if ( config.appInfo.isGateway ) {
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
			host: config.redis.host,
			port: config.redis.port
		}
	} );

	app.get<PrismaService>( PRISMA_SERVICE ).applyShutdownHooks( app );

	await app.startAllMicroservices();
	await app.listen( config.appInfo.port );

	logger.info( `${ config.appInfo.name } started on ${ config.appInfo.url }!` );
}