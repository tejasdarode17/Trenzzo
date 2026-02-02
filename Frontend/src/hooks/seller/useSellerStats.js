import { fetchSellerStatsAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";


export function useSellerStats() {
    return useQuery({
        queryKey: ["sellerStats"],
        queryFn: fetchSellerStatsAPI,
    })
}