import type { QueryResolvers } from "../graphql/generated/index.js";
import { meQueryResolver } from "./me.query.js";

export * from "./me.query.js";

export const queryResolvers: QueryResolvers = {
	me: meQueryResolver
};