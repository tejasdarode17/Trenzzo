import { fetchOrderDetailAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query"

export const useUserOrderDetail = (orderId) => {
    return useQuery({
        queryKey: ["order", { orderId }],
        queryFn: () => fetchOrderDetailAPI(orderId),
        enabled: !!orderId,
    });
};
