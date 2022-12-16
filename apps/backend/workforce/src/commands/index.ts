import { CommandBus } from "@shaastra/cqrs";
import { CreateMemberCommand } from "./create.member.command.js";
import { CreateTeamCommand } from "./create.team.command.js";
import { EnableMemberCommand } from "./enable.member.command.js";

const commandBus = new CommandBus();
commandBus.registerCommand( CreateMemberCommand );
commandBus.registerCommand( CreateTeamCommand );
commandBus.registerCommand( EnableMemberCommand );

export { commandBus };

export * from "./create.member.command.js";
export * from "./create.team.command.js";
export * from "./enable.member.command.js";