import { fetchProductDetails } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail({ slug }) {
    return useQuery({
        queryKey: ["productDetails", { slug }],
        queryFn: () => fetchProductDetails({ slug }),
        keepPreviousData: true,
        onError: (error) => {
            console.log(error);
        }
    })
}