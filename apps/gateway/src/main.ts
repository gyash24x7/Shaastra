import { bootstrap } from "@shaastra/utils/nest";
import { AppModule } from "./app.module";
import waitOn from "wait-port";

const host = "localhost";

if ( process.env[ "NODE_ENV" ] !== "production" ) {
	console.log( "Here" );
	Promise.any( [
		waitOn( { host, port: 8000 } ),
		waitOn( { host, port: 8010 } ),
		waitOn( { host, port: 8020 } )
	] ).then( () => {
		bootstrap( AppModule ).then();
	} );
} else {
	bootstrap( AppModule ).then();
}