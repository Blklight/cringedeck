import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 401) return false;
          return failureCount < 1;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 401) return false;
          return failureCount < 1;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
