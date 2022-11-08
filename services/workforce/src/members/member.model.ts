import { Department, Member, MemberPosition } from "@prisma/client/workforce";
import { Directive, Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { TeamModel } from "../teams/team.model";

registerEnumType( MemberPosition, { name: "MemberPosition" } );
registerEnumType( Department, { name: "Department" } );

@ObjectType( MemberModel.TYPENAME )
@Directive( `@key(fields: "id")` )
export class MemberModel implements Member {
	public static readonly TYPENAME = "Member";
	@Field( () => ID ) id: string;
	@Field() about: string;
	@Field() coverPic: string;
	@Field( () => Department ) department: Department;
	@Field() email: string;
	@Field() enabled: boolean;
	@Field() mobile: string;
	@Field() name: string;
	@Field( () => MemberPosition ) position: MemberPosition;
	@Field() profilePic: string;
	@Field() rollNumber: string;
	@Field() upi: string;

	@Field( () => [ TeamModel ] ) teams: TeamModel[];

}