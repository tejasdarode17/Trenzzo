import { fetchSellerReturnRequestsAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export function useSellerReturn({ filter, page }) {
    return useQuery({
        queryKey: ["sellerReturns", { filter, page }],
        queryFn: () => fetchSellerReturnRequestsAPI({ filter, page }),
        keepPreviousData: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something Went wrong on server")
        },
    })
}