import { NestFactory } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "./services/prisma.service";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import { MercuriusFederationDriver, MercuriusFederationDriverConfig } from "@nestjs/mercurius";
import { ConfigModule as NestConfigModule } from "@nestjs/config/dist/config.module";
import config from "./config";
import { JwtModule as NestJwtModule } from "@nestjs/jwt/dist/jwt.module";
import { readFileSync } from "fs";
import { join } from "path";
import { ConsulModule } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { CqrsModule } from "@nestjs/cqrs";
import { services } from "./services";
import { resolvers } from "./resolvers";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";
import { MailModule } from "@shaastra/mail";

const GraphQLModule = NestGraphQLModule.forRoot<MercuriusFederationDriverConfig>( {
	driver: MercuriusFederationDriver,
	federationMetadata: true,
	graphiql: true,
	autoSchemaFile: true,
	context: ( request: any ) => ( { request } )
} );

const ConfigModule = NestConfigModule.forRoot( { load: [ config ], isGlobal: true } );

const JwtModule = NestJwtModule.registerAsync( {
	imports: [ ConfigModule ],
	inject: [ ConfigService ],
	useFactory( configService: ConfigService ) {
		const audience = configService.getOrThrow<string>( "app.auth.audience" );
		const issuer = `https://${ configService.getOrThrow<string>( "app.auth.domain" ) }`;
		const keyid = configService.getOrThrow<string>( "app.auth.keyId" );
		const algorithm = "RS256";

		const privateKey = readFileSync( join( __dirname, "assets", "keys", ".private.key" ) );
		return {
			privateKey,
			signOptions: { audience, algorithm, issuer, keyid },
			verifyOptions: { audience, algorithms: [ algorithm ], issuer }
		}
	}
} );

@Module( {
	imports: [ ConfigModule, ConsulModule, HealthModule, GraphQLModule, JwtModule, CqrsModule, MailModule ],
	providers: [ ...services, ...resolvers, ...commandHandlers, ...queryHandlers ]
} )
export class AppModule {}

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );

	const prismaService = app.get( PrismaService );
	await prismaService.enableShutdownHooks( app );

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
	logger.log( `${ name } Service running on http://localhost:${ port }/graphiql` );
}

bootstrap().then();
