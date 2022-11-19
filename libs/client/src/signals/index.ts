export * from "./mutation";
export * from "./query";

export type GqlError = {
	message: string;
	extensions: {
		code: string;
		response: {
			statusCode: number;
			message: string;
			error: string;
		};
		serviceName: string;
		exception: {
			message: string;
			stacktrace: string[];
		}
	};
}