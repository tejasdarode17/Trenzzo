import { fetchSellerOrdersAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";

export function useSellerOrders({ range, page }) {
    return useQuery({
        queryKey: ["sellerOrders", { range, page }],
        queryFn: () => fetchSellerOrdersAPI({ range, page }),
        keepPreviousData: true,
    })
}



