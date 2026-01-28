import { Skeleton } from "@/components/ui/skeleton"

const WishlistSkeleton = ({ count = 12 }) => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-40" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid gap-3 grid-cols-2  lg:grid-cols-4">

                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gray-100 p-4">
                                <Skeleton className="w-full h-full rounded-md" />
                            </div>

                            {/* Content */}
                            <div className="p-3 space-y-2">
                                {/* Brand + Badge */}
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-14" />
                                    <Skeleton className="h-4 w-12" />
                                </div>

                                {/* Title */}
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />

                                {/* Rating */}
                                <Skeleton className="h-4 w-20" />

                                {/* Price */}
                                <Skeleton className="h-5 w-24" />

                                {/* Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-8 w-full rounded-md" />
                                    <Skeleton className="h-8 w-full rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WishlistSkeleton
