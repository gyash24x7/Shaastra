import type { IQuery } from "@nestjs/cqrs";
import type { GetMembersInput } from "../inputs/get-members";

export class GetMembersQuery implements IQuery {
	constructor( public readonly data: GetMembersInput ) {}
}