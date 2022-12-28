import type { ICommands } from "@shaastra/framework";
import createMemberCommandHandler from "./create.member.command.js";
import createTeamCommandHandler from "./create.team.command.js";
import enableMemberCommandHandler from "./enable.member.command.js";

export * from "./create.member.command.js";
export * from "./create.team.command.js";
export * from "./enable.member.command.js";

export enum AppCommands {
	CREATE_MEMBER_COMMAND = "CREATE_MEMBER_COMMAND",
	CREATE_TEAM_COMMAND = "CREATE_TEAM_COMMAND",
	ENABLE_MEMBER_COMMAND = "ENABLE_MEMBER_COMMAND"
}

const commands: ICommands<AppCommands> = {
	CREATE_MEMBER_COMMAND: createMemberCommandHandler,
	CREATE_TEAM_COMMAND: createTeamCommandHandler,
	ENABLE_MEMBER_COMMAND: enableMemberCommandHandler
};

export default commands;