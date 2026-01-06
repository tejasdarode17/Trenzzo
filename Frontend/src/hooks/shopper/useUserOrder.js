import { useQuery } from "@tanstack/react-query";
import { fetchOrdersAPI } from "@/api/shopper.api";

export const useUserOrders = ({ search, page }) => {
    return useQuery({
        queryKey: ["orders", { search, page }],
        queryFn: () => fetchOrdersAPI({ search, page }),
        keepPreviousData: true,
    });
};
