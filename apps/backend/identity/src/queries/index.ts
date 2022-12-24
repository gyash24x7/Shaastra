import type { IQueries } from "@shaastra/framework";
import userQueryHandler from "./user.query.js";
import type { PrismaClient } from "@prisma/client/identity/index.js";

export * from "./user.query.js";

export enum APP_QUERIES {
	USER_QUERY = "USER_QUERY"
}

const queries: IQueries<PrismaClient> = {
	USER_QUERY: userQueryHandler
};

export default queries;