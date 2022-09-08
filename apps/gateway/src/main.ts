import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );
	await app.listen( 9000 );
	const logger = new Logger( "Bootstrap" );
	logger.log( "Gateway running on http://localhost:9000/graphql" );
}

bootstrap().then();
