import { ExpressApplication } from "@shaastra/framework";

const application = new ExpressApplication( {
	name: "gateway",
	graphql: {
		gateway: true
	}
} );

await application.start();