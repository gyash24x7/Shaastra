import { Directive, Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Department, Member, MemberRole } from "@prisma/client/workforce";

registerEnumType( Department, { name: "Department" } );
registerEnumType( MemberRole, { name: "MemberRole" } );

@ObjectType( MemberModel.TYPENAME )
@Directive( `@key(fields:"id")` )
export class MemberModel implements Member {
	static readonly TYPENAME = "Member";

	@Field( () => ID ) id: string;
	@Field() name: string;
	@Field() email: string;
	@Field() rollNumber: string;
	@Field() userId: string;

	@Field( () => [ Department ] ) departments: Department[];
	@Field( () => MemberRole ) role: MemberRole;

	@Field() mobile: string;
	@Field() profilePic: string;
	@Field() coverPic: string;
	@Field() upi: string;
	@Field() enabled: boolean;
}
