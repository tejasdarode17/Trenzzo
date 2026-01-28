import { initCheckoutAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useInitCheckout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: initCheckoutAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkout"] });
        },
    });
}

