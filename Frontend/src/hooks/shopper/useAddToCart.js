import { addToCartAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToCart() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addToCartAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"])
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Something went wrong on server")
        }
    })
}

