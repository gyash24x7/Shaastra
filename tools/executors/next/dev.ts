import { exec } from "child_process";
import { ExecutorContext } from "nx/src/config/misc-interfaces";

export type NextExecutorOptions = {
	turbopack: boolean;
};

export default function devExecutor( { turbopack }: NextExecutorOptions, context: ExecutorContext ) {
	console.info( `Executing "next dev"...` );

	const projectDir = context.workspace.projects[ context.projectName ].root;

	return new Promise( ( resolve, reject ) => {
		const devProcess = exec(
			`next dev ${ turbopack ? "--turbo" : "" } ${ projectDir }`,
			function ( error, stdout, stderr ) {
				if ( error ) {
					reject( error );
				}
				resolve( { success: !stderr } );
			}
		);

		devProcess.stdout.setEncoding( "utf8" );
		devProcess.stdout.on( "data", console.log );

		devProcess.stderr.setEncoding( "utf8" );
		devProcess.stderr.on( "data", console.error );
	} );
}