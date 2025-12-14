import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import SellersTable from "./SellersTable";
import { useEffect, useState } from "react";
import { fetchAllSellers } from "@/Redux/adminSlice";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const AdminSellers = () => {

    const { sellersData } = useSelector((store) => store.admin)
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultStatus = searchParams.get("status") || "all";
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState(defaultStatus);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        const delay = setTimeout(() => {
            dispatch(fetchAllSellers({ status, page, search: searchText }));
            setLoading(false);
        }, 600);

        return () => clearTimeout(delay);
    }, [searchText, status, page]);


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
                sellers={sellersData.sellers}
                loading={loading}
                page={page}
                pages={sellersData.pages}
                onPageChange={setPage}
            />
        </div>
    )
}

export default AdminSellers;
