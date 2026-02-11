import { fetchSellerProductAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";

export function useSellerProduct({ category, page, status, search, }) {
    return useQuery({
        queryKey: ["sellerProducts", { category, page, status, search }],
        queryFn: () => fetchSellerProductAPI({ category, page, status, search }),
        keepPreviousData: true,
    })
}

