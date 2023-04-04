import { Field, InputType } from "@nestjs/graphql";
import type { Department } from "@prisma/client";

@InputType()
export class CreateTeamInput {
	@Field() name: string;
	@Field() department: Department;
}

@InputType()
export class AddTeamMembersInput {
	@Field() teamId: string;
	@Field() memberIds: string[];
}
