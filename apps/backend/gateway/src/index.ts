import { PrismaClient } from "@prisma/client/identity/index.js";
import { ExpressApplication } from "@shaastra/framework";
import cors from "cors";
import events from "./events/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { loginApi } from "./rest/login.api.js";
import { logoutApi } from "./rest/logout.api.js";
import { signupApi } from "./rest/signup.api.js";
import { verifyEmailApi } from "./rest/verify.email.api.js";

export const prisma = new PrismaClient( {
	log: [ "query", "info", "warn", "error" ]
} );

const application = new ExpressApplication( {
	name: "gateway",
	isGateway: true,
	middlewares: [
		cors( {
			origin: "http://localhost:3000",
			credentials: true
		} )
	],
	prisma,
	events,
	restApis: [ jwksRestApi, loginApi, logoutApi, signupApi, verifyEmailApi ]
} );

application.start().then();