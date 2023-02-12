import { CreateMemberCommandHandler } from "./create.member.command.js";
import { CreateTeamCommandHandler } from "./create.team.command.js";
import { EnableMemberCommandHandler } from "./enable.member.command.js";

export * from "./create.member.command.js";
export * from "./create.team.command.js";
export * from "./enable.member.command.js";

const commandHandlers = [ CreateTeamCommandHandler, CreateMemberCommandHandler, EnableMemberCommandHandler ];
export default commandHandlers;