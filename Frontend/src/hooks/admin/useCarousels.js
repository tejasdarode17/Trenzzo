import { fetchCarouselsAPI } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export function useCarousels() {
    return useQuery({
        queryKey: ["carousels"],
        queryFn: fetchCarouselsAPI,
    })
}