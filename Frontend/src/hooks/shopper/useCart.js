import { fetchCartAPI } from "@/api/shopper.api";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export function useCart() {
    const { isAuthenticated } = useSelector((s) => s.auth);
    return useQuery({
        queryKey: ["cart"],
        queryFn: fetchCartAPI,
        enabled: isAuthenticated
    })
}

