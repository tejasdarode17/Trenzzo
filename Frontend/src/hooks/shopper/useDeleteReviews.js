import { deleteReviewAPI } from "@/api/shopper.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReviewAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["userReviews"]);
            toast.success("Review deleted");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        },
    });
};


