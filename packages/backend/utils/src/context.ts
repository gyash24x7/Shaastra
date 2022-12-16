import type { ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { Consul } from "@shaastra/consul";
import type { CommandBus, EventBus, QueryBus } from "@shaastra/cqrs";
import type { Mailer } from "@shaastra/mail";
import type { Request, Response } from "express";
import type { Signale } from "signale";
import type { AppConfig } from "./config.js";

export type UserAuthInfo ={
	id: string;
	department: string;
	position: string;
}

export type ExpressContext = {
	req: Request;
	res: Response;
}

export type PrismaContext<P> = { prisma: P };

export type CqrsContext = {
	commandBus: CommandBus;
	queryBus: QueryBus;
	eventBus: EventBus;
}

export type MailContext = {
	mailer: Mailer
}

export type LoggerContext = {
	logger: Signale
}

export type ConsulContext = {
	consul: Consul
}

export type ConfigContext = {
	config: AppConfig
}

export type AuthContext = {
	authInfo?: UserAuthInfo;
}

export type ServiceBaseContext =
	ExpressContext
	& ConsulContext
	& LoggerContext
	& ConfigContext
	& MailContext
	& CqrsContext;

export type ServiceContext<P = unknown> = ServiceBaseContext & PrismaContext<P> & AuthContext

export type ServiceContextFn<P = unknown> = ContextFunction<[ ExpressContextFunctionArgument ], ServiceContext<P>>

export type GatewayContext = ExpressContext & ConsulContext & LoggerContext & ConfigContext & {token?:string, logout?:boolean}

export type GatewayContextFn = ContextFunction<[ExpressContextFunctionArgument], GatewayContext>;