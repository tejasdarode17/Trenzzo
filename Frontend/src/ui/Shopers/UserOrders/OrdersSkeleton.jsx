const OrdersSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8 animate-pulse">
            <div className="max-w-4xl mx-auto px-3 sm:px-4">

                {/* Search Skeleton */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="w-full max-w-xl h-11 sm:h-12 bg-gray-200 rounded-lg" />
                </div>

                {/* Orders List */}
                <div className="space-y-5">
                    {[1, 2, 3].map((order) => (
                        <div
                            key={order}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-3 border-b">
                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                </div>

                                <div className="space-y-2 sm:text-right">
                                    <div className="h-3 w-16 bg-gray-200 rounded sm:ml-auto" />
                                    <div className="h-5 w-24 bg-gray-200 rounded sm:ml-auto" />
                                </div>
                            </div>

                            {/* Items */}
                            <div className="px-4 py-4 space-y-4">
                                {[1, 2].map((item) => (
                                    <div key={item} className="flex gap-3 sm:gap-4">
                                        {/* Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0" />

                                        {/* Text */}
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                            <div className="h-5 w-20 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-center gap-2 mt-10">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-9 h-9 bg-gray-200 rounded"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersSkeleton;
