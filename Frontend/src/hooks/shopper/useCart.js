import { fetchCartAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useCart() {
    return useQuery({
        queryKey: ["cart"],
        queryFn: fetchCartAPI
    })
}

