import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { PrismaClientExceptionFilter, WorkforcePrismaService } from "@shaastra/prisma";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );

	const prismaService = app.get( WorkforcePrismaService );
	await prismaService.enableShutdownHooks( app );

	const { httpAdapter } = app.get( HttpAdapterHost );
	app.useGlobalFilters( new PrismaClientExceptionFilter( httpAdapter ) );

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<number>( "app.name" );

	await app.listen( port );

	const logger = new Logger( "Bootstrap" );
	logger.log( `${ name } Service running on http://localhost:${ port }/graphiql` );
}

bootstrap().then();
