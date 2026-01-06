import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"
import SellersTable from "./SellersTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useSellers } from "@/hooks/admin/useSellers";

const AdminSellers = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const defaultStatus = searchParams.get("status") || "all";
    const [status, setStatus] = useState(defaultStatus);
    const [searchText, setSearchText] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("")
    const [page, setPage] = useState(1);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchText)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchText])


    const { data, isLoading: loading } = useSellers({ status, page, search: debounceSearch })
    const sellers = data?.sellers
    const pages = data?.pages


    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search sellers..."
                        className="w-64"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <Select value={status} onValueChange={(newStatus) => { setStatus(newStatus); setSearchParams({ status: newStatus }); }}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspend">Suspended</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <SellersTable
                sellers={sellers}
                loading={loading}
                page={page}
                pages={pages}
                onPageChange={setPage}
            />
        </div>
    )
}

export default AdminSellers;
