import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule as NestConfigModule, registerAs } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import {
	appConfigFactory,
	AuthModule,
	bootstrap,
	deserializeAuthInfo,
	GraphQLModule,
	JwtService,
	LoggerFactory,
	RedisClientModule
} from "@shaastra/framework";
import { CreateChannelCommandHandler } from "./commands/create.channel.command.js";
import { CreateMessageCommandHandler } from "./commands/create.message.command.js";
import { ChannelCreatedEventHandler } from "./events/channel.created.event.js";
import { MessageCreatedEventHandler } from "./events/message.created.event.js";
import { PrismaService } from "./prisma/prisma.service.js";
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

const appConfig = registerAs( "app", appConfigFactory( "connect" ) );
const ConfigModule = NestConfigModule.forRoot( { isGlobal: true, load: [ appConfig ] } );

@Module( {
	imports: [ CqrsModule, RedisClientModule, AuthModule, GraphQLModule, ConfigModule ],
	providers: [ PrismaService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...resolvers ]
} )
class AppModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( AppModule );

	constructor( private readonly jwtService: JwtService ) {}

	configure( consumer: MiddlewareConsumer ) {
		consumer.apply( deserializeAuthInfo( this.jwtService, false ) ).forRoutes( "*" );
		this.logger.info( "AppModule Middlewares Applied!" );
	}
}

await bootstrap( AppModule, PrismaService );
