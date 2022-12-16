import { generateKeyPairSync } from "crypto";
import { join } from "path";
import { writeFileSync } from "fs";

const { publicKey, privateKey } = generateKeyPairSync( "rsa", {
	modulusLength: 4096,
	publicKeyEncoding: { type: "spki", format: "pem" },
	privateKeyEncoding: {
		type: "pkcs8",
		format: "pem",
		cipher: "aes-256-cbc",
		passphrase: process.env[ "KEY_PASSPHRASE" ]
	}
} );


writeFileSync(
	join( __dirname, "..", "services", "identity", "src", "assets", "keys", ".private.key" ),
	privateKey
);
writeFileSync(
	join( __dirname, "..", "services", "identity", "src", "assets", "keys", ".public.key.pem" ),
	publicKey
);