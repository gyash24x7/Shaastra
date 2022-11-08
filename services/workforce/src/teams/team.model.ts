import { Department, Team } from "@prisma/client/workforce";
import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import { MemberModel } from "../members/member.model";

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