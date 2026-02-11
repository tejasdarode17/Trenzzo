import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/shopper/useProducts";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductsCard";
import ProductSkeleton from "./ProductSkelton";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "relevance";
    const page = Number(searchParams.get("page") || 1);
    const category = searchParams.get("catID")

    const { data, isLoading } = useProducts({ search, sort, page, category });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const skeletonCount = 8;

    function changePage(nextPage) {
        setSearchParams(prev => {
            prev.set("page", nextPage);
            return prev;
        });
    }


    if (products.length == 0 && isLoading == false) {
        return (
            <NoProductsFound></NoProductsFound>
        )
    }


    return (
        <div className="px-2 md:px-5 pb-4 mt-2">
            {/* Heading */}
            {search && (
                <p className="text-sm md:text-lg font-semibold mb-3">
                    Showing results for "{search}"
                </p>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
                {isLoading
                    ? Array.from({ length: skeletonCount }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                    : products?.map(product => (
                        <ProductCard key={product?._id} product={product} />
                    ))}
            </div>

            {/* Pagination (desktop + fallback mobile) */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-1 flex-wrap">
                    <Button
                        disabled={page === 1}
                        onClick={() => changePage(page - 1)}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                            key={i}
                            size="sm"
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
                        size="sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};




const NoProductsFound = () => {

    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <SearchX className="w-8 h-8 text-gray-400" />
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                No products found
            </h2>

            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Try changing your search or filters.
            </p>

            {/* <Button
                variant="outline"
                className="mt-5"
                onClick={() => navigate("/products")}
            >
                Browse all products
            </Button> */}
        </div>
    );
};



export default Products;
