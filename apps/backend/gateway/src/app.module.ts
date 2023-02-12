import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/identity/index.js";
import {
	ConfigModule as BaseConfigModule,
	PrismaModule as BasePrismaModule,
	RedisClientModule,
	AuthModule,
	GraphQLModule,
	LoggerFactory,
	ExtractAuthMiddleware,
	CONFIG_DATA,
	AppConfig
} from "@shaastra/framework";
import cookieParser from "cookie-parser";
import commandHandlers from "./commands/index.js";
import controllers from "./controllers/index.js";
import eventHandlers from "./events/index.js";
import { RequireAuthMiddleware } from "./middlewares/index.js";
import queryHandlers from "./queries/index.js";

export const prismaClientFactory = ( config: AppConfig ) => new PrismaClient( {
	log: [ "query", "info", "warn", "error" ],
	datasources: { db: config.db }
} );

const ConfigModule = BaseConfigModule.register( "gateway" );
const PrismaModule = BasePrismaModule.registerAsync( {
	imports: [ ConfigModule ],
	inject: [ CONFIG_DATA ],
	useFactory: prismaClientFactory
} );

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