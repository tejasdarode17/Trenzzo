import { fetchProductDetailsAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail({ slug }) {
    return useQuery({
        queryKey: ["productDetails", { slug }],
        queryFn: () => fetchProductDetailsAPI({ slug }),
        keepPreviousData: true,
    })
}