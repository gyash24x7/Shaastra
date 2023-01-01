import { ExpressApplication } from "@shaastra/framework";
import cors from "cors";

const application = new ExpressApplication( {
	name: "gateway",
	graphql: {
		gateway: true
	},
	middlewares: [
		cors( {
			origin: "http://localhost:3000",
			credentials: true
		} )
	]
} );

await application.start();