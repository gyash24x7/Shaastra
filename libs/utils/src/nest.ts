import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

export async function bootstrap( AppModule: any ) {
	const app = await NestFactory.create( AppModule );
	const logger = new Logger( "Bootstrap" );

	app.use( cookieParser() );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<string>( "app.name" );

	app.enableShutdownHooks();

	await app.listen( port );

	logger.log( `${ name } running on http://localhost:${ port }/api/graphql` );
	return app;
}
