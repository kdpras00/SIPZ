import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      console.log("Fetching:", queryKey.join("/"));
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
      });

      console.log("Query response status:", res.status);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Unauthorized, returning null");
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log("Query response data:", data);
      return data;
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed from "throw" to "returnNull"
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Changed from Infinity to 0
      gcTime: 0, // Changed from undefined to 0
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
