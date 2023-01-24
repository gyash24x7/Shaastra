import { MiddlewareConsumer, Module, NestModule, UnauthorizedException } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import {
	appConfigFactory,
	AuthModule,
	bootstrap,
	deserializeAuthInfo,
	ExpressMiddleware,
	GraphQLModule,
	JwtService,
	LoggerFactory,
	RedisClientModule,
	UserAuthInfo
} from "@shaastra/framework";
import { PrismaService } from "./prisma/prisma.service.js";
import { CreateTokenCommandHandler } from "./commands/create.token.command.js";
import { CreateUserCommandHandler } from "./commands/create.user.command.js";
import { LoginCommandHandler } from "./commands/login.command.js";
import { VerifyUserCommandHandler } from "./commands/verify.user.command.js";
import { UserCreatedEventHandler } from "./events/user.created.event.js";
import { UserQueryHandler } from "./queries/user.query.js";
import { AuthController } from "./controllers/auth.controller.js";
import { ConfigModule as NestConfigModule, registerAs } from "@nestjs/config";
import { InboundController } from "./controllers/inbound.controller.js";
import cookieParser from "cookie-parser";

const eventHandlers = [ UserCreatedEventHandler ];
const queryHandlers = [ UserQueryHandler ];
const commandHandlers = [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];

const appConfig = registerAs( "app", appConfigFactory( "gateway" ) );
const ConfigModule = NestConfigModule.forRoot( { isGlobal: true, load: [ appConfig ] } );

@Module( {
	imports: [ CqrsModule, RedisClientModule, AuthModule, GraphQLModule, ConfigModule ],
	providers: [ PrismaService, ...commandHandlers, ...queryHandlers, ...eventHandlers ],
	controllers: [ AuthController, InboundController ]
} )
class AppModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( AppModule );

	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService
	) {}

	configure( consumer: MiddlewareConsumer ) {
		consumer.apply( cookieParser(), deserializeAuthInfo( this.jwtService, true ) ).forRoutes( "*" );
		consumer.apply( this.requireAuthenticatedUser() ).forRoutes( "/api/auth/logout" );
		this.logger.info( "AppModule Middlewares Applied!" );
	}

	requireAuthenticatedUser(): ExpressMiddleware {
		return async ( _req, res, next ) => {
			const authInfo: UserAuthInfo | undefined = res.locals[ "authInfo" ];

			if ( !authInfo?.id ) {
				this.logger.warn( "No AuthInfo Found!" );
				throw new UnauthorizedException();
			}

			const user = await this.prismaService.user.findUnique( { where: { id: authInfo.id } } );
			if ( !user ) {
				this.logger.warn( "No User Found!" );
				throw new UnauthorizedException();
			}

			next();
		};
	}

}

await bootstrap( AppModule, PrismaService );
