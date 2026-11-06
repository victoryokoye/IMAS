import { QueryClient } from "@tanstack/react-query";
import { toAppError } from "../utils/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data is "fresh" for 1 minute: no refetch on remount
      gcTime: 10 * 60_000, // keep unused cache for 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const { status } = toAppError(error);
        if (status && status < 500) return false; // never retry 4xx
        return failureCount < 2; // retry network errors / 5xx twice
      },
    },
    mutations: { retry: false },
  },
});
