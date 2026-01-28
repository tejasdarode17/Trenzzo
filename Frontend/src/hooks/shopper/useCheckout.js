import { checkOutAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useCheckout() {
    return useQuery({
        queryKey: ["checkout"],
        queryFn: checkOutAPI,
        staleTime: 0,
    });
}


