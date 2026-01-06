import { fetchSellersAPI } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export function useSellers({ status, page, search }) {
    return useQuery({
        queryKey: ["sellers", { status, page, search }],
        queryFn: () => fetchSellersAPI({ status, page, search }),
    })
}