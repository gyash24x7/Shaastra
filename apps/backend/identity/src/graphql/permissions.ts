import { isAuthenticated } from "@shaastra/auth";
import { not, shield } from "graphql-shield";

export const permissions = shield( {
	Mutation: {
		login: not( isAuthenticated ),
		signup: not( isAuthenticated ),
		logout: isAuthenticated
	}
} );