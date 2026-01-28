import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"
import SellersTable from "./SellersTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        <div className="p-3 sm:p-4 lg:p-6 space-y-4">

            {/* Header + Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    Sellers
                </h1>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                    {/* Search */}
                    <Input
                        placeholder="Search sellers..."
                        className="w-full sm:w-64 h-9 text-sm"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(newStatus) => {
                            setStatus(newStatus);
                            setSearchParams({ status: newStatus });
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
                            <SelectValue placeholder="Status" />
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

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <SellersTable
                    sellers={sellers}
                    loading={loading}
                    page={page}
                    pages={pages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}

export default AdminSellers;
