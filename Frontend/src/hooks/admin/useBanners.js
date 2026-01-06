import { fetchBannersAPI } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export function useBanners() {
    return useQuery({
        queryKey: ["banners"],
        queryFn: fetchBannersAPI
    })
}