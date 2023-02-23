import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/identity/index.js";
import {
	AuthModule,
	ConfigModule as BaseConfigModule,
	ExtractAuthMiddleware,
	GraphQLModule,
	LoggerFactory,
	PrismaModule as BasePrismaModule,
	RedisClientModule
} from "@shaastra/framework";
import cookieParser from "cookie-parser";
import commandHandlers from "./commands/index.js";
import controllers from "./controllers/index.js";
import eventHandlers from "./events/index.js";
import { RequireAuthMiddleware } from "./middlewares/index.js";
import queryHandlers from "./queries/index.js";

const ConfigModule = BaseConfigModule.register( "gateway" );
const PrismaModule = BasePrismaModule.register( PrismaClient );

@Module( {
	imports: [ CqrsModule, RedisClientModule, AuthModule, GraphQLModule, PrismaModule, ConfigModule ],
	providers: [ ...commandHandlers, ...queryHandlers, ...eventHandlers ],
	controllers
} )
export class AppModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( AppModule );

	configure( consumer: MiddlewareConsumer ) {
		consumer.apply( cookieParser(), ExtractAuthMiddleware ).forRoutes( "*" );
		consumer.apply( RequireAuthMiddleware ).forRoutes( "/api/auth/logout" );
		this.logger.info( "AppModule Middlewares Applied!" );
	}
}