const ProductDetailsSkeleton = () => {
    return (
        <div className="w-full bg-white animate-pulse">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb – Desktop only */}
                <div className="hidden lg:block px-4 py-3">
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 p-3 lg:p-4">

                    {/* IMAGE SECTION */}
                    <div className="flex-1">

                        {/* Mobile Image */}
                        <div className="lg:hidden h-[280px] bg-gray-200 rounded-lg mb-4" />

                        {/* Desktop Images */}
                        <div className="hidden lg:flex gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-14 h-14 bg-gray-200 rounded" />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 h-[400px] bg-gray-200 rounded-lg" />
                        </div>

                        {/* Image Action Buttons */}
                        <div className="flex gap-2 mt-3">
                            <div className="h-9 flex-1 bg-gray-200 rounded" />
                            <div className="h-9 flex-1 bg-gray-200 rounded" />
                        </div>
                    </div>

                    {/* DETAILS SECTION */}
                    <div className="flex-1 lg:max-w-2xl space-y-4">

                        {/* Brand + Title */}
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-6 w-3/4 bg-gray-200 rounded" />
                        </div>

                        {/* Rating */}
                        <div className="h-10 bg-gray-200 rounded-lg" />

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="h-7 w-1/3 bg-gray-200 rounded" />
                            <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        </div>

                        {/* Highlights */}
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                            ))}
                        </div>

                        {/* Stock + Delivery */}
                        <div className="h-14 bg-gray-200 rounded-lg" />
                        <div className="h-14 bg-gray-200 rounded-lg" />
                    </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 p-4 space-y-2">
                    <div className="h-5 w-1/4 bg-gray-200 rounded" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                    ))}
                </div>
            </div>

            {/* Mobile Sticky Buy Bar Placeholder */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-4">
                <div className="flex gap-3">
                    <div className="h-10 w-1/3 bg-gray-200 rounded" />
                    <div className="h-10 flex-1 bg-gray-200 rounded" />
                    <div className="h-10 flex-1 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
