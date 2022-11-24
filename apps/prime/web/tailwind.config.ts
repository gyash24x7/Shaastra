import type { Config } from "tailwindcss";
import { join } from "path";
import theme from "@shaastra/configs/tailwind/theme.json" assert { type: "json" };

const config: Config = {
	content: [
		join( __dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html}" ),
		join( __dirname, "../../../libs/ui/**/*!(*.stories|*.spec).{ts,tsx,html}" )
	],
	// @ts-ignore
	theme,
	plugins: []
};

export default config;
