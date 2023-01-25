import { QueryClientProvider, QueryClient, useQueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient( {
	defaultOptions: {
		queries: {
			refetchInterval: false,
			refetchOnWindowFocus: false,
			retry: false
		}
	}
} );

export const ClientProvider = QueryClientProvider;

export function useClient() {
	return useQueryClient();
}