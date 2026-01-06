import { fetchUserReviewsAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export const useUserReviews = () => {
    return useQuery({
        queryKey: ["userReviews"],
        queryFn: fetchUserReviewsAPI,
    });
};
