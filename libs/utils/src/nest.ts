import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";

export async function bootstrap( AppModule: any ) {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );
	const logger = new Logger( "Bootstrap" );

	app.enableCors( {
		origin: "http://localhost:3000",
		credentials: true
	} );

	await app.register( fastifyCookie as any );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<string>( "app.name" );

	app.enableShutdownHooks();

	await app.listen( port );

	logger.log( `${ name } running on http://localhost:${ port }/api/graphql` );
	return app;
}
