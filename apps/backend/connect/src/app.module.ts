import { AuthModule, ExtractAuthMiddleware } from "@app/framework/auth";
import { ConfigModule as BaseConfigModule } from "@app/framework/config";
import { GraphQLModule } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { PrismaModule as BasePrismaModule } from "@app/framework/prisma";
import { RedisClientModule } from "@app/framework/redis";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/connect";
import commandHandlers from "./commands";
import eventHandlers from "./events";
import queryHandlers from "./queries";
import resolvers from "./resolvers";

const ConfigModule = BaseConfigModule.register( "connect" );
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