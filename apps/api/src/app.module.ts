import { AuthModule, ConfigModule, PrismaModule } from "@api/common";
import { eventListeners, resolvers, services } from "@api/domain";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { GraphQLModule } from "@nestjs/graphql";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const EventModule = EventEmitterModule.forRoot();
const GqlModule = GraphQLModule.forRoot( {
	driver: ApolloDriver,
	path: "/api/graphql",
	typeDefs: readFileSync( join( __dirname, "assets/schema.graphql" ) ),
	context: ( { req, res }: ExpressContextFunctionArgument ) => (
		{ req, res }
	)
} );

@Module( {
	imports: [ AuthModule, ConfigModule, PrismaModule, GqlModule, EventModule ],
	providers: [ ...services, ...eventListeners, ...resolvers ]
} )
export class AppModule {}
