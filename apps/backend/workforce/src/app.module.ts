import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/workforce/index.js";
import {
	AuthModule,
	ConfigModule as BaseConfigModule,
	ExtractAuthMiddleware,
	GraphQLModule,
	LoggerFactory,
	PrismaModule as BasePrismaModule,
	RedisClientModule
} from "@shaastra/framework";
import commandHandlers from "./commands/index.js";
import eventHandlers from "./events/index.js";
import queryHandlers from "./queries/index.js";
import resolvers from "./resolvers/index.js";

const ConfigModule = BaseConfigModule.register( "workforce" );
const PrismaModule = BasePrismaModule.register( PrismaClient );

@Module( {
	imports: [ CqrsModule, RedisClientModule, AuthModule, GraphQLModule, PrismaModule, ConfigModule ],
	providers: [ ...commandHandlers, ...queryHandlers, ...eventHandlers, ...resolvers ]
} )
export class AppModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( AppModule );

	configure( consumer: MiddlewareConsumer ) {
		consumer.apply( ExtractAuthMiddleware ).forRoutes( "*" );
		this.logger.info( "AppModule Middlewares Applied!" );
	}
}