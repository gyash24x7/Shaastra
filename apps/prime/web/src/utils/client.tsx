import { createClient } from "@api/client";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient( {
	defaultOptions: {
		queries: {
			refetchInterval: false,
			refetchOnWindowFocus: false,
			retry: false
		}
	}
} );

export const genqlClient = createClient( {
	url: "http://localhost:8000/api/graphql",
	credentials: "include"
} );