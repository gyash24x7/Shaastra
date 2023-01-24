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
import { CreateMemberCommandHandler } from "./commands/create.member.command.js";
import { CreateTeamCommandHandler } from "./commands/create.team.command.js";
import { EnableMemberCommandHandler } from "./commands/enable.member.command.js";
import { MemberCreatedEventHandler } from "./events/member.created.event.js";
import { MemberEnabledEventHandler } from "./events/member.enabled.event.js";
import { TeamCreatedEventHandler } from "./events/team.created.event.js";
import { PrismaService } from "./prisma/prisma.service.js";
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

const appConfig = registerAs( "app", appConfigFactory( "workforce" ) );
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
