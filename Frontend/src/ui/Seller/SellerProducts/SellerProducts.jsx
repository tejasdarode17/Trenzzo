import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import ProductsTable from "./ProductsTable";
import AccessDenied from "../AccessDenied";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSellerProduct } from "@/hooks/seller/useSellerProduct";
import { useCatogery } from "@/hooks/admin/useCategory";
import { Package2, Plus } from "lucide-react";

const SellerProducts = () => {
    const { userData } = useSelector((store) => store.auth);
    const { data: categories } = useCatogery()

    const [selectedCategory, setSelectedCategory] = useState("");
    const [productStatus, setProductStatus] = useState("");
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    const [page, setPage] = useState(1);

    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    const handleSearchEnter = (e) => {
        if (e.key === "Enter") {
            setDebouncedSearchText(searchText);
            setPage(1);
        }
    };

    const { data, isLoading: productsLoading } = useSellerProduct({ category: selectedCategory, page, status: productStatus, search: debouncedSearchText })
    const products = data?.products
    const pages = data?.pages


    if (["pending", "banned", "rejected", "suspended"].includes(userData?.status)) {
        return <AccessDenied status={userData?.status} />;
    }

    return (
        <div className="w-full px-4 py-6 min-h-screen">

            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3"> 
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Products
                        </h1>
                    </div>
                    <Button size="sm" onClick={() => navigate("/seller/add-product")} variant="secondary">Add Product <Plus></Plus> </Button>
                </div>


                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearchEnter}
                        placeholder="Search by product name..."
                        className="sm:max-w-sm"
                    />

                    <div className="flex gap-2 flex-wrap">
                        <Select value={productStatus} onValueChange={(val) => { setProductStatus(val); setPage(1); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inActive">Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setPage(1); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All</SelectItem>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ProductsTable products={products} productsLoading={productsLoading} />

                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
                    <span>
                        Showing {products?.length} items
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>

                        <span className="px-2">{page}</span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === pages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SellerProducts;
