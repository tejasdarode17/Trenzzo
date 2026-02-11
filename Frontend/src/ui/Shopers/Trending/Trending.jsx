import { useTrending } from "@/hooks/shopper/useTrending";
import React from "react";
import ProductSkeleton from "../Products/ProductSkelton";
import ProductCard from "../Products/ProductsCard";
import { Separator } from "@/components/ui/separator";

const Trending = () => {

    const { data: products, isLoading } = useTrending()
    const skeletonCount = 8;

    return (
        <section className="mb-4 md:mt-8 px-3 md:px-6">
            <Separator></Separator>

            <h2 className="text-lg md:text-xl font-bold lg:mt-10 mt-7 mb-3">
                Trending Products
            </h2>

            {/* later this will be a map */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* placeholder cards */}
                {isLoading
                    ? Array.from({ length: skeletonCount }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                    : products?.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
            </div>
        </section>
    );
};

export default Trending;
