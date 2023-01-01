import type { IQueries } from "@shaastra/framework";
import userQueryHandler from "./user.query.js";

export * from "./user.query.js";

export enum AppQueries {
	USER_QUERY = "USER_QUERY"
}

const queries: IQueries<AppQueries> = {
	USER_QUERY: userQueryHandler
};

export default queries;