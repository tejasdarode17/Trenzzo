import { FetchDeliveryPartnersAPI } from "@/api/seller.api";
import { useQuery } from "@tanstack/react-query";

export function useSellerDeliveryPartner() {
    return useQuery({
        queryKey: ["deliveryPartners"],
        queryFn: FetchDeliveryPartnersAPI,
        keepPreviousData: true,
    })
}
