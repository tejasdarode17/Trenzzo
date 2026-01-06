import { fetchWishlistAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";

export function useWishlist() {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: fetchWishlistAPI,
    })
}