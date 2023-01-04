import { join } from "node:path";
import { writeFileSync } from "node:fs";
import * as jose from "jose";

const { publicKey, privateKey } = await jose.generateKeyPair( "RS256" );

writeFileSync( join( process.cwd(), "src", "assets", "keys", ".private.key" ), await jose.exportPKCS8( privateKey ) );
writeFileSync( join( process.cwd(), "src", "assets", "keys", ".public.key.pem" ), await jose.exportSPKI( publicKey ) );