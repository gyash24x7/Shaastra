import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaClient } from "@prisma/client/workforce/index.js";
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
import commandHandlers from "./commands/index.js";
import { MemberCreatedEventHandler } from "./events/member.created.event.js";
import { MemberEnabledEventHandler } from "./events/member.enabled.event.js";
import { TeamCreatedEventHandler } from "./events/team.created.event.js";
import { MemberQueryHandler } from "./queries/member.query.js";
import { MembersQueryHandler } from "./queries/members.query.js";
import { TeamQueryHandler } from "./queries/team.query.js";
import { TeamsQueryHandler } from "./queries/teams.query.js";
import { MemberResolvers } from "./resolvers/member.resolvers.js";
import { MutationResolvers } from "./resolvers/mutation.resolvers.js";
import { QueryResolvers } from "./resolvers/query.resolvers.js";
import { TeamResolvers } from "./resolvers/team.resolvers.js";

const eventHandlers = [ MemberCreatedEventHandler, MemberEnabledEventHandler, TeamCreatedEventHandler ];
const queryHandlers = [ MembersQueryHandler, MemberQueryHandler, TeamsQueryHandler, TeamQueryHandler ];
const resolvers = [ QueryResolvers, MutationResolvers, MemberResolvers, TeamResolvers ];

export const prismaClientFactory = ( config: AppConfig ) => new PrismaClient( {
	log: [ "query", "info", "warn", "error" ],
	datasources: { db: config.db }
} );

const ConfigModule = BaseConfigModule.register( "workforce" );
const PrismaModule = BasePrismaModule.registerAsync( {
	imports: [ ConfigModule ],
	inject: [ CONFIG_DATA ],
	useFactory: prismaClientFactory
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