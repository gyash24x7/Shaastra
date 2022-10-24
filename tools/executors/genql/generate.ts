import { exec } from "child_process";
import type { ExecutorContext } from "@nrwl/devkit";

export interface GenqlGenerateOptions {
	endpoint: string;
}

export default async function generateExecutor(
	{ endpoint }: GenqlGenerateOptions,
	context: ExecutorContext
) {
	console.info( `Executing "genql generate"...` );

	return new Promise( ( resolve, reject ) => {
		const devProcess = exec(
			`genql generate --endpoint ${ endpoint } --output ${ context.root }/node_modules/@genql/runtime/client`,
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