import { fetchProductsAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useProducts({ search, page, sort }) {
    return useQuery({
        queryKey: ["products", { search, page, sort }],
        queryFn: () => fetchProductsAPI({ search, page, sort }),
        keepPreviousData: true,
        staleTime: 60_000,
    })
}
