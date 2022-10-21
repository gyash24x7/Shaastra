import { ConfigModule as NestConfigModule } from "@nestjs/config/dist/config.module";
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql/dist/graphql.module";
import type { ApolloFederationDriverConfig } from "@nestjs/apollo";
import { apolloServerOptions } from "@shaastra/utils/graphql";
import { ConsulModule } from "@shaastra/consul";
import { HealthModule } from "@shaastra/health";
import { AuthModule } from "@shaastra/auth";
import { Module } from "@nestjs/common";
import { JwksController } from "./jwks.controller";
import config from "./config";
import { TokenModule } from "../tokens/token.module";
import { RoleModule } from "../roles/role.module";
import { UserModule } from "../users/user.module";

const ConfigModule = NestConfigModule.forRoot( { load: [ config ], isGlobal: true } );

const GraphQLModule = NestGraphQLModule.forRoot<ApolloFederationDriverConfig>( apolloServerOptions );

@Module( {
	imports: [
		ConfigModule,
		ConsulModule,
		HealthModule,
		GraphQLModule,
		AuthModule,
		TokenModule,
		RoleModule,
		UserModule
	],
	controllers: [ JwksController ]
} )
export class AppModule {}