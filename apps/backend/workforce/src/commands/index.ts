import { CreateMemberCommandHandler } from "./create.member.command";
import { CreateTeamCommandHandler } from "./create.team.command";
import { EnableMemberCommandHandler } from "./enable.member.command";

export * from "./create.member.command";
export * from "./create.team.command";
export * from "./enable.member.command";

const commandHandlers = [ CreateTeamCommandHandler, CreateMemberCommandHandler, EnableMemberCommandHandler ];
export default commandHandlers;