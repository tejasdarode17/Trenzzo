import { addReviewAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostReview = () => {

    const queryClient = useQueryClient()

    return useMutation({

        mutationFn: addReviewAPI,

        onSuccess: () => {
            queryClient.invalidateQueries(["userReviews"]);
            // this function should be run in componentn not in hook 
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