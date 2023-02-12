import { MemberQueryHandler } from "./member.query.js";
import { MembersQueryHandler } from "./members.query.js";
import { TeamQueryHandler } from "./team.query.js";
import { TeamsQueryHandler } from "./teams.query.js";

export * from "./member.query.js";
export * from "./team.query.js";
export * from "./members.query.js";
export * from "./teams.query.js";

const queryHandlers = [ MembersQueryHandler, MemberQueryHandler, TeamsQueryHandler, TeamQueryHandler ];
export default queryHandlers;