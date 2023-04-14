import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { TeamService } from "../services";

@Resolver( "Team" )
export class TeamResolver {

	constructor( private readonly teamService: TeamService ) {}

	@ResolveField()
	async createdBy( @Parent() { id }: { id: string; } ) {
		return this.teamService.getTeamCreator( id );
	}

	@ResolveField()
	async members( @Parent() { id }: { id: string; } ) {
		return this.teamService.getTeamMembers( id );
	}
}
