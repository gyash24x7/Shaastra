import { Field, InputType } from "@nestjs/graphql";
import { Department } from "@shaastra/prisma";

@InputType()
export class CreateMemberInput {
	@Field() name: string;
	@Field() email: string;
	@Field() rollNumber: string;
	@Field() userId: string;
	@Field() mobile: string;
	@Field( () => [ Department ] ) departments: Department[];
}