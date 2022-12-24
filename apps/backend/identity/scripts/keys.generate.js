import { generateKeyPairSync } from "node:crypto";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const { publicKey, privateKey } = generateKeyPairSync( "rsa", {
	modulusLength: 4096,
	publicKeyEncoding: { type: "spki", format: "pem" },
	privateKeyEncoding: {
		type: "pkcs8",
		format: "pem",
		cipher: "aes-256-cbc",
		passphrase: process.env[ "AUTH_KEY_PASSPHRASE" ]
	}
} );


writeFileSync( join( process.cwd(), "src", "assets", "keys", ".private.key" ), privateKey );
writeFileSync( join( process.cwd(), "src", "assets", "keys", ".public.key.pem" ), publicKey );