import { useQuery } from "@tanstack/react-query";

interface UserData {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

export function useAuth() {
  const { data, isLoading, refetch, error } = useQuery<UserData>({
    queryKey: ["api", "user"],
    retry: false,
    staleTime: 0, // Selalu refresh data
    gcTime: 0, // Tidak cache data (gcTime menggantikan cacheTime di v5)
  });

  // Log untuk debugging
  console.log("Auth data:", data);
  console.log("Auth error:", error);

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
    refetch,
  };
}