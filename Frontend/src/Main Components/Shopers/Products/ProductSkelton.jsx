const ProductSkeleton = () => {
    return (
        <div className="border rounded-md p-2 md:p-3 bg-white animate-pulse">
            {/* Image */}
            <div className="w-full h-36 md:h-40 bg-gray-200 rounded-sm" />

            {/* Brand + Assured */}
            <div className="flex gap-2 mt-2">
                <div className="h-3 w-14 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>

            {/* Product name */}
            <div className="mt-2 space-y-1">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Price + delivery */}
            <div className="flex justify-between items-center mt-2">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
        </div>
    );
};

export default ProductSkeleton;
