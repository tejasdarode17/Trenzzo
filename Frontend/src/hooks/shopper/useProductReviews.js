import { fetchProductReviewsAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useProductReviews({ productID }) {
    return useQuery({
        queryKey: ["productReviews"],
        queryFn: () => fetchProductReviewsAPI({ productID }),
        throwOnError: (error) => {
            console.log(error);
        }
    })
}