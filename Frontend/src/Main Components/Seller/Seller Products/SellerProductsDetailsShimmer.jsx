const ShimmerBlock = ({ className = "" }) => (
    <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
)

const SellerProductsDetailsShimmer = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 px-5 py-4">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                        <ShimmerBlock className="h-7 w-52 sm:w-64" />
                        <ShimmerBlock className="h-4 w-72 sm:w-96" />
                    </div>

                    <ShimmerBlock className="h-10 w-full sm:w-40" />
                </div>

                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5">

                        {/* Image Section */}
                        <div className="lg:col-span-2 p-3 sm:p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-3">

                            {/* Main Image */}
                            <ShimmerBlock className="w-full h-[260px] sm:h-[320px] lg:h-[380px] rounded-xl" />

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ShimmerBlock key={i} className="h-16 sm:h-20 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:col-span-3 p-4 sm:p-5 lg:p-6 space-y-6">

                            {/* Title */}
                            <div className="space-y-3">
                                <ShimmerBlock className="h-7 w-3/4" />
                                <ShimmerBlock className="h-4 w-1/2" />
                            </div>

                            {/* Price + Stock */}
                            <div className="flex flex-wrap gap-4">
                                <ShimmerBlock className="h-12 w-40 rounded-xl" />
                                <ShimmerBlock className="h-10 w-32 rounded-lg" />
                            </div>

                            {/* Highlights */}
                            <div className="space-y-3">
                                <ShimmerBlock className="h-5 w-40" />
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <ShimmerBlock key={i} className="h-4 w-full" />
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
                                <ShimmerBlock className="h-10 w-full sm:w-40" />
                                <ShimmerBlock className="h-10 w-full sm:w-40" />
                                <ShimmerBlock className="h-10 w-full sm:w-40" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-4 sm:p-5 lg:p-6 space-y-3">
                    <ShimmerBlock className="h-6 w-52" />
                    <ShimmerBlock className="h-4 w-full" />
                    <ShimmerBlock className="h-4 w-full" />
                    <ShimmerBlock className="h-4 w-3/4" />
                </div>

            </div>
        </div>
    )
}



export default SellerProductsDetailsShimmer