import { MemberService } from "./member.service";
import { TeamService } from "./team.service";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

export * from "./member.service";
export * from "./team.service";
export * from "./token.service";
export * from "./user.service";

export const services = [ MemberService, UserService, TeamService, TokenService ];
