import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import ProductsActionButton from "./ProductsActionButtons";
import SellerProductsTableShimmer from "./SellerProductsTableShimmer";
import { Package, } from "lucide-react";

const ProductsTable = ({ products, productsLoading }) => {

    const navigate = useNavigate()

    if (productsLoading) {
        return (
            <SellerProductsTableShimmer></SellerProductsTableShimmer>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="flex justify-center items-center">
                        <Package className="w-10 h-10 text-blue-600 " />
                    </div>

                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent my-3">
                        No Products Found
                    </h2>
                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                        It looks like you haven't added any products yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ================= Desktop / Tablet Table ================= */}
            <div className="hidden md:block">

                {/* Header */}
                <div className="grid grid-cols-7 font-semibold text-sm text-gray-500 bg-gray-100 px-6 py-3 border-b">
                    <span>Product</span>
                    <span>Image</span>
                    <span>Category</span>
                    <span>Stock</span>
                    <span>Price</span>
                    <span>Status</span>
                    <span className="text-center">Action</span>
                </div>

                {/* Body */}
                <ScrollArea className="h-[600px]">
                    {products.map((product) => (
                        <div
                            onClick={() => navigate(`/seller/product/${product?.slug}`)}
                            key={product?._id}
                            className="grid grid-cols-7 items-center text-sm px-6 py-4 border-b hover:bg-gray-50 transition"
                        >
                            {/* Name */}
                            <p className="font-medium text-gray-800 hover:underline">
                                {product?.name}
                            </p>

                            {/* Image */}
                            <div>
                                <img
                                    src={product?.images?.[0]?.url}
                                    alt={product?.name}
                                    className="h-12 w-12 rounded object-cover border"
                                />
                            </div>

                            {/* Category */}
                            <span className="text-gray-600">
                                {product?.category?.name || "—"}
                            </span>

                            {/* Stock */}
                            <span className={product.stock === 0 ? "text-red-600 font-semibold" : product.stock <= 1 ? "text-yellow-600 font-semibold" : "text-green-600 font-semibold"}>
                                {product.stock}
                            </span>

                            {/* Price */}
                            <span className="font-semibold text-gray-800">
                                ₹{product.price}
                            </span>

                            {/* Status */}
                            <span>
                                {product.active ? (
                                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-700">Inactive</Badge>
                                )}
                            </span>

                            {/* Action */}
                            <div
                                className="text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ProductsActionButton product={product} />
                            </div>
                        </div>
                    ))}
                </ScrollArea >
            </div >

            {/* ================= Mobile Cards ================= */}
            < div className="md:hidden space-y-3 p-3" >
                {
                    products.map((product) => (
                        <div
                            onClick={() => navigate(`/seller/product/${product?.slug}`)}
                            key={product?._id}
                            className="bg-white border rounded-lg p-3 flex gap-3 shadow-sm"
                        >
                            {/* Image */}
                            <img
                                src={product?.images?.[0]?.url}
                                alt={product?.name}
                                className="h-16 w-16 rounded object-cover border"
                            />

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm leading-tight">
                                        {product?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {product?.category?.name || "Uncategorized"}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex flex-col text-xs">
                                        <span className="font-semibold text-gray-800">
                                            ₹{product.price}
                                        </span>

                                        <span className={product.stock === 0 ? "text-red-600 font-medium" : product.stock <= 10 ? "text-yellow-600 font-medium" : "text-green-600 font-medium"}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {product.active ? (
                                            <Badge className="bg-green-100 text-green-700 text-xs">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 text-xs">
                                                Inactive
                                            </Badge>
                                        )}

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ProductsActionButton product={product} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default ProductsTable;
