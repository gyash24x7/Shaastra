import { AppModule } from "./app.module.js";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create( AppModule );
	const logger = new Logger( "Bootstrap" );

	app.enableCors( {
		origin: "http://localhost:3000",
		credentials: true
	} );
	app.use( cookieParser() );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<string>( "app.name" );

	app.enableShutdownHooks();

	await app.listen( port );

	logger.log( `${ name } running on http://localhost:${ port }/api/graphql` );
	return app;
}

bootstrap().then();