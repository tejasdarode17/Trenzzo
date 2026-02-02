import { fetchSellerOrderDetailsAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query"

export const useSellerOrderDetails = (orderId) => {
    return useQuery({
        queryKey: ["sellerOrderDetails", { orderId }],
        queryFn: () => fetchSellerOrderDetailsAPI(orderId),
        enabled: !!orderId,
    });
};


