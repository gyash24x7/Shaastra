import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/identity";
import {
	ConfigModule as BaseConfigModule,
	PrismaModule as BasePrismaModule,
	RedisClientModule,
	AuthModule,
	GraphQLModule,
	LoggerFactory,
	ExtractAuthMiddleware
} from "@shaastra/framework";
import cookieParser from "cookie-parser";
import { CreateTokenCommandHandler } from "./commands/create.token.command.js";
import { CreateUserCommandHandler } from "./commands/create.user.command.js";
import { LoginCommandHandler } from "./commands/login.command.js";
import { VerifyUserCommandHandler } from "./commands/verify.user.command.js";
import { AuthController } from "./controllers/auth.controller.js";
import { InboundController } from "./controllers/inbound.controller.js";
import { UserCreatedEventHandler } from "./events/user.created.event.js";
import { RequireAuthMiddleware } from "./middlewares/require.auth.middleware.js";
import { UserQueryHandler } from "./queries/user.query.js";

const eventHandlers = [ UserCreatedEventHandler ];
const queryHandlers = [ UserQueryHandler ];
const commandHandlers = [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];

const ConfigModule = BaseConfigModule.register( "gateway" );
const PrismaModule = BasePrismaModule.register( { client: PrismaClient } );

@Module( {
	imports: [ CqrsModule, RedisClientModule, AuthModule, GraphQLModule, PrismaModule, ConfigModule ],
	providers: [ ...commandHandlers, ...queryHandlers, ...eventHandlers ],
	controllers: [ AuthController, InboundController ]
} )
export class AppModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( AppModule );

	configure( consumer: MiddlewareConsumer ) {
		consumer.apply( cookieParser(), ExtractAuthMiddleware ).forRoutes( "*" );
		consumer.apply( RequireAuthMiddleware ).forRoutes( "/api/auth/logout" );
		this.logger.info( "AppModule Middlewares Applied!" );
	}
}