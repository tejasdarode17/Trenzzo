import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Star, ThumbsUp, } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useProductReviews } from "@/hooks/shopper/useProductReviews";

const ProductReviews = () => {
    const { slug } = useParams();
    const productID = slug?.split("-").pop();

    const { data, isLoading } = useProductReviews({ productID });
    const reviews = data?.reviews ?? [];

    const ratingStats = useMemo(() => {
        if (reviews.length === 0) return null;

        const totalReviews = reviews.length;
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        let totalRating = 0;
        for (const review of reviews) {
            totalRating += review.rating;
            ratingDistribution[review.rating]++;
        }

        return {
            totalReviews,
            averageRating: (totalRating / totalReviews).toFixed(1),
            ratingDistribution,
            positivePercentage: Math.round(
                ((ratingDistribution[5] + ratingDistribution[4]) / totalReviews) * 100
            ),
        };
    }, [reviews]);

    if (isLoading) return (
        <div className="p-4">
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-40 bg-gray-100 rounded"></div>
            </div>
        </div>
    );

    if (reviews.length === 0) return null;

    return (
        <div className="border-t border-gray-200">
            <div className="p-4 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Customer Reviews
                </h2>

                {/* Rating Overview */}
                {ratingStats && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 lg:p-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6">
                            {/* Average Rating */}
                            <div className="text-center">
                                <div className="bg-white rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center border border-amber-200">
                                    <div>
                                        <p className="text-xl lg:text-2xl font-bold text-gray-900">
                                            {ratingStats.averageRating}
                                        </p>
                                        <div className="flex justify-center gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${star <= Math.round(ratingStats.averageRating)
                                                        ? "text-amber-500 fill-current"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs lg:text-sm text-gray-600 mt-2">
                                    {ratingStats.totalReviews} reviews
                                </p>
                            </div>

                            {/* Distribution */}
                            <div className="flex-1 space-y-1.5 lg:space-y-2 min-w-0">
                                {[5, 4, 3, 2, 1].map(rating => {
                                    const percentage =
                                        (ratingStats.ratingDistribution[rating] /
                                            ratingStats.totalReviews) *
                                        100;

                                    return (
                                        <div key={rating} className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                                            <div className="flex items-center gap-1 w-10 lg:w-12">
                                                <span>{rating}</span>
                                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                            </div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 lg:h-2 min-w-[60px]">
                                                <div
                                                    className="bg-amber-500 h-1.5 lg:h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="w-6 lg:w-10 text-xs text-gray-600 text-right">
                                                {ratingStats.ratingDistribution[rating]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Positive Summary */}
                            <div className="text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-end gap-1 mb-1">
                                    <ThumbsUp className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">
                                        {ratingStats.positivePercentage}%
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">Positive reviews</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Review List */}
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div
                            key={review._id}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                            <div className="flex gap-3 lg:gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 flex items-center justify-center font-semibold text-sm lg:text-base flex-shrink-0">
                                    {review?.user?.username?.[0]?.toUpperCase() || "U"}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-1">
                                        <div>
                                            <p className="font-semibold text-sm lg:text-base truncate">
                                                {review?.user?.username || "Anonymous"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-3 h-3 lg:w-4 lg:h-4 ${star <= review.rating
                                                        ? "text-amber-500 fill-current"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm whitespace-pre-line break-words">
                                        {review.comment}
                                    </p>

                                    {review?.image?.url && (
                                        <img
                                            src={review.image.url}
                                            alt="Review"
                                            className="mt-3 w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default ProductReviews