import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { WorkforcePrismaService } from "@shaastra/prisma";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );

	const prismaService = app.get( WorkforcePrismaService );
	await prismaService.enableShutdownHooks( app );

	await app.listen( 8000 );

	const logger = new Logger( "Bootstrap" );
	logger.log( "Workforce Service running on http://localhost:8000/graphql" );
}

bootstrap().then();
