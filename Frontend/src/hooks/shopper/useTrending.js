import { fetchTrendingAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useTrending() {
    return useQuery({
        queryKey: ["trending"],
        queryFn: fetchTrendingAPI,
        keepPreviousData: true,
        staleTime: 60_000,
    })
}