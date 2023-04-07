import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { MemberService } from "../services";

@Resolver( "Member" )
export class MemberResolver {

	constructor( private readonly memberService: MemberService ) { }

	@ResolveField()
	async teams( @Parent() { id }: { id: string; } ) {
		return this.memberService.getTeamsPartOf( id );
	}

	@ResolveField()
	async tasksCreated( @Parent() { id }: { id: string; } ) {
		return this.memberService.getTasksCreated( id );
	}

	@ResolveField()
	async tasksAssigned( @Parent() { id }: { id: string; } ) {
		return this.memberService.getTasksAssigned( id );
	}
}
