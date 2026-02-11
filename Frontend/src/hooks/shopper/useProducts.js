import { fetchProductsAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useProducts({ search, page, sort, category }) {
    return useQuery({
        queryKey: ["products", { search, page, sort, category }],
        queryFn: () => fetchProductsAPI({ search, page, sort, category }),
        keepPreviousData: true,
        staleTime: 60_000,
    })
}
