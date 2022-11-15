import { exec } from "child_process";
import { ExecutorContext } from "@nrwl/devkit";

export type StorybookExecutorOptions = {};

export default function devExecutor( _: StorybookExecutorOptions, context: ExecutorContext ) {
	console.info( `Executing "start-storybook"...` );

	const projectDir = context.workspace.projects[ context.projectName ].root;

	return new Promise( ( resolve, reject ) => {
		const devProcess = exec(
			`start-storybook --port=4400 --no-open --config-dir=${ projectDir }/.storybook --ci --modern`,
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