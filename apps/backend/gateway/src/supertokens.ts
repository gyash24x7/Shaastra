import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Jwt from "supertokens-node/recipe/jwt";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";
import type { TypeInput } from "supertokens-node/types";

export const supertokensConfig: TypeInput = {
	framework: "express",
	supertokens: {
		connectionURI: "http://127.0.0.1:3567"
	},
	appInfo: {
		appName: "Shaastra",
		apiDomain: "http://127.0.0.1:9000",
		websiteDomain: "http://127.0.0.1:3000",
		apiBasePath: "/api/auth",
		websiteBasePath: "/auth"
	},
	recipeList: [
		EmailPassword.init(),
		Session.init(),
		Dashboard.init(),
		UserRoles.init(),
		Jwt.init()
	]
};
