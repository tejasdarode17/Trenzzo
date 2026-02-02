import { addNewProductAPI } from "@/api/seller.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



export function useSellerNewProduct() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addNewProductAPI,

        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts"])
        },

        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }

    })

}