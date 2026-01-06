import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/shopper/useProducts";
import { ChevronLeft, ChevronRight, Loader2, Shield, Truck, } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "relevance";
    const page = Number(searchParams.get("page") || 1);

    const { data, isLoading } = useProducts({ search, sort, page, });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin"></Loader2>
            </div>
        );
    }

    const products = data?.products || [];
    const currentPage = data?.currentPage || 1;
    const totalPages = data?.totalPages || 1;

    function changePage(nextPage) {
        setSearchParams(prev => {
            prev.set("page", nextPage);
            return prev;
        });
    }

    return (
        <div className="p-5">
            <p className="text-lg font-semibold mb-5">
                Showing results for "{search}"
            </p>

            {products?.map(product => (
                <div
                    key={product._id}
                    onClick={() =>
                        navigate(`/product/${product?.slug}`)
                    }
                    className="flex gap-4 p-4 border-b cursor-pointer hover:bg-gray-50"
                >
                    <img
                        src={product?.images[0]?.url}
                        alt={product?.name}
                        className="w-40 h-40 object-contain"
                    />

                    <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                            <span className="text-xs bg-gray-100 px-2 py-1">
                                {product?.brand}
                            </span>
                            <span className="bg-green-600 text-white text-xs px-2 py-1 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Assured
                            </span>
                        </div>

                        <h1 className="font-semibold text-lg">
                            {product?.name}
                        </h1>

                        <div className="mt-2 text-sm">
                            {product?.highlights?.map((h, i) => (
                                <p key={i}>• {h}</p>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-between">
                            <p className="text-2xl font-bold">
                                ₹{product?.price?.toLocaleString("en-IN")}
                            </p>
                            <div className="flex items-center gap-1 text-green-600">
                                <Truck className="w-4 h-4" />
                                Free delivery
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <Button
                    disabled={page === 1}
                    onClick={() => changePage(page - 1)}
                    variant="outline"
                >
                    <ChevronLeft className="w-4 h-4" /> Prev
                </Button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "outline"}
                        onClick={() => changePage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    disabled={page === totalPages}
                    onClick={() => changePage(page + 1)}
                    variant="outline"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default Products;
