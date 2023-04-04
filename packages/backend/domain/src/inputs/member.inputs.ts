import { Field, InputType } from "@nestjs/graphql";
import type { Department } from "@prisma/client";

@InputType()
export class CreateMemberInput {
	@Field() name: string;
	@Field() email: string;
	@Field() rollNumber: string;
	@Field() department: Department;
	@Field() mobile: string;
	@Field() password: string;
}

@InputType()
export class EnableMemberInput {
	@Field() id: string;
}
