import { fetchSellerAPI } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export function useSeller(id) {
    return useQuery({
        queryKey: ["seller"],
        queryFn: () => fetchSellerAPI(id),
    })
}