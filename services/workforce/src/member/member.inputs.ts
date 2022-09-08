import { Field, InputType } from "@nestjs/graphql";
import { Department } from "@prisma/client/workforce";

@InputType()
export class CreateMemberInput {
	@Field() name: string;
	@Field() email: string;
	@Field() rollNumber: string;
	@Field() userId: string;
	@Field() mobile: string;
	@Field( () => [ Department ] ) departments: Department[];
}

@InputType()
export class GetMembersInput {
	@Field( { nullable: true } ) team?: string;
	@Field( () => Department, { nullable: true } ) department?: Department;
}