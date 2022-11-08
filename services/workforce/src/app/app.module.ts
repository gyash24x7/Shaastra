import { ConfigModule as NestConfigModule } from "@nestjs/config/dist/config.module";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import type { ApolloFederationDriverConfig } from "@nestjs/apollo";
import { apolloServerOptions } from "@shaastra/utils/graphql";
import { ConsulModule } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { AuthModule } from "@shaastra/auth";
import { Module } from "@nestjs/common";
import appConfig from "./app.config";
import { MemberModule } from "../members/member.module";
import { TeamModule } from "../teams/team.module";

const ConfigModule = NestConfigModule.forRoot( { load: [ appConfig ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRoot<ApolloFederationDriverConfig>( apolloServerOptions );

@Module( {
	imports: [
		ConfigModule,
		ConsulModule,
		HealthModule,
		GraphQLModule,
		AuthModule,
		MemberModule,
		TeamModule
	]
} )
export class AppModule {}