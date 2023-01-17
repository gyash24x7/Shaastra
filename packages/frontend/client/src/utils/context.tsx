import { QueryClientProvider, QueryClient, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient( {
	defaultOptions: {
		queries: {
			refetchInterval: false,
			refetchOnWindowFocus: false,
			retry: false
		}
	}
} );

export function ClientProvider( props: { children: ReactNode } ) {
	return (
		<QueryClientProvider client={ queryClient }>
			{ props.children }
		</QueryClientProvider>
	);
}

export function useClient() {
	return useQueryClient();
}