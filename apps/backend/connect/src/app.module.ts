import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/connect/index.js";
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
import { CreateChannelCommandHandler } from "./commands/create.channel.command.js";
import { CreateMessageCommandHandler } from "./commands/create.message.command.js";
import { ChannelCreatedEventHandler } from "./events/channel.created.event.js";
import { MessageCreatedEventHandler } from "./events/message.created.event.js";
import { ChannelQueryHandler } from "./queries/channel.query.js";
import { MessageQueryHandler } from "./queries/message.query.js";
import { MessagesQueryHandler } from "./queries/messages.query.js";
import { ChannelResolvers } from "./resolvers/channel.resolvers.js";
import { MessageResolvers } from "./resolvers/message.resolvers.js";
import { MutationResolvers } from "./resolvers/mutation.resolvers.js";
import { QueryResolvers } from "./resolvers/query.resolvers.js";

const eventHandlers = [ MessageCreatedEventHandler, ChannelCreatedEventHandler ];
const queryHandlers = [ MessagesQueryHandler, MessageQueryHandler, ChannelQueryHandler ];
const commandHandlers = [ CreateMessageCommandHandler, CreateChannelCommandHandler ];
const resolvers = [ QueryResolvers, MutationResolvers, MessageResolvers, ChannelResolvers ];

const ConfigModule = BaseConfigModule.register( "connect" );
const PrismaModule = BasePrismaModule.registerAsync( {
	imports: [ ConfigModule ],
	inject: [ CONFIG_DATA ],
	useFactory( config: AppConfig ) {
		return new PrismaClient( {
			log: [ "query", "info", "warn", "error" ],
			datasources: { db: config.db }
		} );
	}
} );

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