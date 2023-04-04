import * as jose from "jose";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

jose.generateKeyPair( "RS256" ).then( async ( { privateKey, publicKey } ) => {
	await writeFile(
		join( __dirname, "..", "src", "assets", "keys", ".private.key" ),
		await jose.exportPKCS8( privateKey )
	);

	await writeFile(
		join( __dirname, "..", "src", "assets", "keys", ".public.key.pem" ),
		await jose.exportSPKI( publicKey )
	);
} );
