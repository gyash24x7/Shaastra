import { PrismaClient } from "@prisma/client/identity/index.js";
import { ExpressApplication, requireUser } from "@shaastra/framework";
import cookieParser from "cookie-parser";
import cors from "cors";
import events from "./events/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { loginApi } from "./rest/login.api.js";
import { logoutApi } from "./rest/logout.api.js";
import { signupApi } from "./rest/signup.api.js";
import { verifyEmailApi } from "./rest/verify.email.api.js";
import { verifyMemberCreateApi } from "./rest/verify.member.create.api.js";

export const prisma = new PrismaClient( {
	log: [ "query", "info", "warn", "error" ]
} );

const application = new ExpressApplication( {
	name: "gateway",
	isGateway: true,
	middlewares: [
		{ fn: cookieParser() },
		{ fn: cors( { origin: "http://localhost:3000", credentials: true } ) },
		{ path: "/api/graphql", fn: requireUser() }
	],
	prisma,
	events,
	restApis: [ jwksRestApi, loginApi, logoutApi, signupApi, verifyEmailApi, verifyMemberCreateApi ]
} );

application.start().then();