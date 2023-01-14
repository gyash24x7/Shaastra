import * as jose from "jose";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const { privateKey, publicKey } = await jose.generateKeyPair( "RS256" );

await writeFile(
	join( process.cwd(), "src", "assets", "keys", ".private.key" ),
	await jose.exportPKCS8( privateKey )
);

await writeFile(
	join( process.cwd(), "src", "assets", "keys", ".public.key.pem" ),
	await jose.exportSPKI( publicKey )
);