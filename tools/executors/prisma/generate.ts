import { exec } from "child_process";
import { promisify } from "util";

export interface PrismaExecutorOptions {
	schemaPath: string;
}

export default async function generateExecutor( options: PrismaExecutorOptions ) {
	console.info( `Executing "prisma generate"...` );
	console.info( `Options: ${ JSON.stringify( options, null, 2 ) }` );

	const { stdout, stderr } = await promisify( exec )(
		`prisma generate --schema ${ options.schemaPath }`
	);
	console.log( stdout );
	console.error( stderr );

	const success = !stderr;
	return { success };
}