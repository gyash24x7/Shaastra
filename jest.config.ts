import { getJestProjects } from "@nrwl/jest";
import type { Config } from "jest";

const jestConfig: Config = {
	projects: getJestProjects()
};

export default jestConfig;