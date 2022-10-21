import { exec } from "child_process";

export default async function dbPushExecutor( _, context ) {
	console.info( `Executing "prisma db push"...` );

	const projectDir = context.workspace.projects[ context.projectName ].root;

	return new Promise( ( resolve, reject ) => {
		const devProcess = exec(
			`prisma db push --schema ${ projectDir }/src/prisma/schema.prisma`,
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