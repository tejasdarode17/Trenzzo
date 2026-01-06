import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "@/api/shopper.api";

export function useAddresses() {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: fetchAddresses
    })
}