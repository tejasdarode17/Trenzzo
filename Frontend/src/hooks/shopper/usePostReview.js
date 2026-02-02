import { addReviewAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostReview = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addReviewAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["userReviews"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        },
    })
}