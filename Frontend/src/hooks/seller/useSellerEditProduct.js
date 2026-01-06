import { editProductAPI } from "@/api/seller.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSellerEditProduct(id) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload) => editProductAPI({ ...payload, id }),
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries(["sellerProducts"])
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    })
}

