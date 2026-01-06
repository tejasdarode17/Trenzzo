import { fetchCategoriesAPI } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

export function useCatogery() {
    return useQuery({
        queryKey: ["category"],
        queryFn: fetchCategoriesAPI
    })
}

