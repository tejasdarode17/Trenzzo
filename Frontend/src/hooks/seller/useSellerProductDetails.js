import { fetchSellerProductDetails } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";

export function useSellerProductDetails({ slug }) {
    return useQuery({
        queryKey: ["productDetails", { slug }],
        queryFn: () => fetchSellerProductDetails({ slug }),
        keepPreviousData: true,
    })
}