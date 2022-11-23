import { Department, Team } from "../prisma";
import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import { MemberModel } from "./member.model";

@ObjectType( TeamModel.TYPENAME )
@Directive( `@key(fields: "id")` )
export class TeamModel implements Team {
	public static readonly TYPENAME = "Team";
	@Field( () => ID ) id: string;
	@Field() createdById: string;
	@Field( () => Department ) department: Department;
	@Field() name: string;

	@Field( () => [ MemberModel ] ) members: MemberModel[];
}