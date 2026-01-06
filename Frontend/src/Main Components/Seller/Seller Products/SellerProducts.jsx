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
        <div className="w-full p-6 min-h-screen">
            <div>

                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Products List</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/seller/add-product")} variant="outline">Add Product</Button>
                    </div>
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
