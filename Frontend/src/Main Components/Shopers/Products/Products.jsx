import { Button } from "@/components/ui/button";
import { fetchSearchProducts } from "@/Redux/productsSlice";
import { ChevronLeft, ChevronRight, Shield, Truck } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const Products = () => {
    const { products, loading, currentPage, totalPages } = useSelector((store) => store.product);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white w-full min-h-screen p-5">
            <div>
                <p className="text-lg font-semibold mb-5">
                    Showing Result for "{searchQuery}"
                </p>
            </div>

            <div className="border border-gray-200 rounded-lg">
                {products.map((product) => (
                    <div
                        onClick={() => {
                            navigate(`/product/${product?.slug}`);
                        }}
                        key={product?._id}
                        className="flex gap-4 p-4 rounded-md mb-6 items-start cursor-pointer group hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                        <div className="flex-shrink-0 w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                            <img
                                src={product?.images[0]?.url || ""}
                                alt={product?.name}
                                className="object-contain w-48 h-48"
                            />
                        </div>

                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {product?.brand}
                                </span>
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Assured
                                </span>
                            </div>

                            <h1 className="font-semibold text-lg transition-colors duration-200 group-hover:text-amber-600 mb-2">
                                {product?.brand} {product?.name} {product?.attributes.storage} {product.attributes?.colour}
                            </h1>

                            <div className="mt-2 text-sm">
                                {product?.highlights?.map((line, index) => (
                                    <p key={index} className="text-sm text-gray-700 flex items-center gap-2">
                                        <span className="text-green-600 font-bold">•</span> {line}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <p className="flex items-center text-2xl font-bold text-gray-900">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Truck className="w-4 h-4" />
                                    <span>Free delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


                {/* footer pagination  */}

                <div className="flex justify-center mt-10 mb-2">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => dispatch(fetchSearchProducts({ page: currentPage - 1, query: searchQuery }))}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Button>

                        {
                            Array.from({ length: totalPages }).map((_, index) => (
                                <Button
                                    key={index + 1}
                                    variant={currentPage === index + 1 ? "default" : "outline"}
                                    onClick={() => dispatch(fetchSearchProducts({ page: index + 1, query: searchQuery }))}
                                    className={currentPage === index + 1 ? "bg-amber-500 hover:bg-amber-600" : "border-gray-300 hover:bg-gray-50"}
                                >
                                    {index + 1}
                                </Button>
                            ))
                        }

                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => dispatch(fetchSearchProducts({ page: currentPage + 1, query: searchQuery }))}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>

                    </div>
                </div>
            </div>

        </div>

    );
};

export default Products;


