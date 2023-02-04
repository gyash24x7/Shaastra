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
	ExtractAuthMiddleware
} from "@shaastra/framework";
import { CreateMemberCommandHandler } from "./commands/create.member.command.js";
import { CreateTeamCommandHandler } from "./commands/create.team.command.js";
import { EnableMemberCommandHandler } from "./commands/enable.member.command.js";
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
const commandHandlers = [ CreateMemberCommandHandler, CreateTeamCommandHandler, EnableMemberCommandHandler ];
const resolvers = [ QueryResolvers, MutationResolvers, MemberResolvers, TeamResolvers ];

const PrismaModule = BasePrismaModule.register( { client: PrismaClient } );
const ConfigModule = BaseConfigModule.register( "workforce" );

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