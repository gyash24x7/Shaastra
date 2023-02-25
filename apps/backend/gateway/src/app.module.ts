import { AuthModule, ExtractAuthMiddleware } from "@app/framework/auth";
import { ConfigModule as BaseConfigModule } from "@app/framework/config";
import { GraphQLModule } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { PrismaModule as BasePrismaModule } from "@app/framework/prisma";
import { RedisClientModule } from "@app/framework/redis";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/gateway";
import cookieParser from "cookie-parser";
import commandHandlers from "./commands";
import controllers from "./controllers";
import eventHandlers from "./events";
import { RequireAuthMiddleware } from "./middlewares";
import queryHandlers from "./queries";

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