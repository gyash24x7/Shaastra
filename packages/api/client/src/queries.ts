import type { Client, Department, TeamGenqlSelection } from "./generated";

export const meQueryFn = ( client: Client ) => {
	return () => client.query( { me: { id: true, name: true } } );
};

export const teamsQueryFn = ( client: Client, selection: TeamGenqlSelection ) => {
	return ( args: { department: Department } ) => {
		return client.query( { teams: { __args: args, ...selection } } );
	};
};