import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );

	app.enableCors( {
		origin: "http://localhost:3000",
		allowedHeaders: [ "content-type" ],
		credentials: true
	} );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<number>( "app.name" );
	await app.listen( port );

	const logger = new Logger( "Bootstrap" );
	logger.log( `${ name } running on http://localhost:${ port }/graphiql` );
}

bootstrap().then();
