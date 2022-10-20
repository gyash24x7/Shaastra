import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { Logger, Type } from "@nestjs/common";
import type { PrismaShutdownHook } from "@shaastra/utils/prisma";

export async function bootstrap<T>( AppModule: any, prismaServiceClass?: Type<T> ) {
	const app = await NestFactory.create( AppModule );
	const logger = new Logger( "Bootstrap" );

	app.use( cookieParser() );

	if ( !!prismaServiceClass ) {
		const prismaService: PrismaShutdownHook = app.get( prismaServiceClass );
		prismaService?.enableShutdownHooks( app );
		logger.log( "Prisma Shutdown Hooks enabled!" );
	}

	const configService = app.get( ConfigService );
	const port = configService.getOrThrow<number>( "app.port" );
	const name = configService.getOrThrow<string>( "app.name" );

	await app.listen( port );

	logger.log( `${ name } running on http://localhost:${ port }/api/graphql` );
	return app;
}
