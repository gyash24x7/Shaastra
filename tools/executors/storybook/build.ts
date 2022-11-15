import { exec } from "child_process";
import { ExecutorContext } from "@nrwl/devkit";

export default async function buildExecutor( _, context: ExecutorContext ) {
	console.info( `Executing "build-storybook"...` );

	const projectDir = context.workspace.projects[ context.projectName ].root;
	const outputDir = "dist/" + context.workspace.projects[ context.projectName ].root;

	return new Promise( ( resolve, reject ) => {
		const devProcess = exec(
			`build-storybook --config-dir=${ projectDir }/.storybook --output-dir=${ outputDir } --modern`,
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