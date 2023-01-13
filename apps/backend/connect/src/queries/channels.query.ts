import type { QueryResolvers } from "../graphql/generated/index.js";

export const channelsQueryResolver: QueryResolvers["channels"] =
	async function () {
		return [];
	};