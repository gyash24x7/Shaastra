import { Field, InputType } from "@nestjs/graphql";
import { Department } from "@shaastra/prisma";

@InputType()
export class GetMembersInput {
	@Field( { nullable: true } ) team?: string;
	@Field( () => Department, { nullable: true } ) department?: Department;
}