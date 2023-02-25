import { MemberQueryHandler } from "./member.query";
import { MembersQueryHandler } from "./members.query";
import { TeamQueryHandler } from "./team.query";
import { TeamsQueryHandler } from "./teams.query";

export * from "./member.query";
export * from "./team.query";
export * from "./members.query";
export * from "./teams.query";

const queryHandlers = [ MembersQueryHandler, MemberQueryHandler, TeamsQueryHandler, TeamQueryHandler ];
export default queryHandlers;