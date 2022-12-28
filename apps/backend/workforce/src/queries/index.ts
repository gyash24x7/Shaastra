import type { IQueries } from "@shaastra/framework";
import deptCoreQueryHandler from "./dept-core.query.js";
import memberQueryHandler from "./member.query.js";
import membersQueryHandler from "./members.query.js";
import teamQueryHandler from "./team.query.js";
import teamsQueryHandler from "./teams.query.js";

export * from "./dept-core.query.js";
export * from "./member.query.js";
export * from "./members.query.js";
export * from "./team.query.js";
export * from "./teams.query.js";

export enum AppQueries {
	DEPT_CORE_QUERY = "DEPT_CORE_QUERY",
	MEMBER_QUERY = "MEMBER_QUERY",
	MEMBERS_QUERY = "MEMBERS_QUERY",
	TEAM_QUERY = "TEAM_QUERY",
	TEAMS_QUERY = "TEAMS_QUERY",
}

const queries: IQueries<AppQueries> = {
	DEPT_CORE_QUERY: deptCoreQueryHandler,
	MEMBER_QUERY: memberQueryHandler,
	MEMBERS_QUERY: membersQueryHandler,
	TEAM_QUERY: teamQueryHandler,
	TEAMS_QUERY: teamsQueryHandler
};

export default queries;