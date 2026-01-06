import { addReviewAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostReview = () => {

    const queryClient = useQueryClient()

    return useMutation({

        mutationFn: addReviewAPI,

        onMutate: async (newReview) => {
            await queryClient.cancelQueries(["userReviews"]);
            const previousReviews = queryClient.getQueryData(["userReviews"]);
            queryClient.setQueriesData(["userReviews"], (old) => ({ ...old, userReviews: [newReview, ...(old?.userReviews || [])] }))
            return { previousReviews };
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries(["userReviews"]);
            toast.success("Review added successfully!");
            setRating(0);
            setReview("");
            setImage(null);
            setOpen(false);
        },

        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        },

    })
}