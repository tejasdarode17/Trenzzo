import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/shopper/useProducts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductsCard";
import ProductSkeleton from "./ProductSkelton";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "relevance";
    const page = Number(searchParams.get("page") || 1);


    // bas yahape category bhejni hai 
    const { data, isLoading } = useProducts({ search, sort, page });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const skeletonCount = 8;

    function changePage(nextPage) {
        setSearchParams(prev => {
            prev.set("page", nextPage);
            return prev;
        });
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
                    : products.map(product => (
                        <ProductCard key={product._id} product={product} />
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

export default Products;
