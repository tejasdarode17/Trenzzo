import { checkOutAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useCheckout(source) {
    return useQuery({
        queryKey: ["checkout", source],
        queryFn: checkOutAPI,
        staleTime: 0,
    });
}


