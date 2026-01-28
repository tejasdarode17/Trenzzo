const shimmer = "animate-pulse bg-gray-200 rounded";

const SellerProductsTableShimmer = () => {
    return (
        <>
            {/* ================= Desktop / Tablet ================= */}
            <div className="hidden md:block">

                {/* Header shimmer */}
                <div className="grid grid-cols-7 bg-gray-100 px-6 py-3 border-b">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={`${shimmer} h-4 w-24`} />
                    ))}
                </div>

                {/* Rows shimmer */}
                <div className="divide-y">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-7 items-center px-6 py-4 gap-4"
                        >
                            {/* Name */}
                            <div className={`${shimmer} h-4 w-40`} />

                            {/* Image */}
                            <div className={`${shimmer} h-12 w-12`} />

                            {/* Category */}
                            <div className={`${shimmer} h-4 w-24`} />

                            {/* Stock */}
                            <div className={`${shimmer} h-4 w-12`} />

                            {/* Price */}
                            <div className={`${shimmer} h-4 w-16`} />

                            {/* Status */}
                            <div className={`${shimmer} h-5 w-16`} />

                            {/* Action */}
                            <div className="flex justify-center">
                                <div className={`${shimmer} h-8 w-8 rounded-full`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= Mobile ================= */}
            <div className="md:hidden space-y-3 p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white border rounded-lg p-3 flex gap-3 shadow-sm"
                    >
                        {/* Image */}
                        <div className={`${shimmer} h-16 w-16`} />

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className={`${shimmer} h-4 w-40`} />
                                <div className={`${shimmer} h-3 w-24`} />
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="space-y-1">
                                    <div className={`${shimmer} h-4 w-16`} />
                                    <div className={`${shimmer} h-3 w-20`} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`${shimmer} h-5 w-14`} />
                                    <div className={`${shimmer} h-8 w-8 rounded-full`} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SellerProductsTableShimmer;
