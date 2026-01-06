import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToCartThunk, buyNowThunk } from "@/Redux/cartSlice";
import { ChevronRight, Share2, Heart, Shield, Star, CheckCircle, XCircle, AlertTriangle, ShoppingCart, Zap, Truck, Calendar, FileText, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { useProductReviews } from "@/hooks/shopper/useProductReviews";
import { useProductDetail } from "@/hooks/shopper/useProductDetail";
import { useWishlist } from "@/hooks/shopper/useWishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductToWishlist } from "@/api/shopper.api";

const ProductDetails = () => {
    const [mainImage, setMainImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { slug } = useParams()

    const { data, isLoading: productLoading } = useProductDetail({ slug })
    const product = data?.product

    const { data: wishlist } = useWishlist()
    const hasWishlisted = wishlist?.some((id) => id === product?._id)
    const [isWishlisted, setIsWishlisted] = useState(hasWishlisted)

    const queryClient = useQueryClient()

    const { mutate: addToWishlist, isPending: wishlistAdding } = useMutation({
        mutationFn: addProductToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries(["wishlist"])
            setIsWishlisted((prev) => !prev)
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    function handleAddWishlist() {
        addToWishlist({ productID: product?._id })
    }

    useEffect(() => {
        setMainImage(product?.images?.[0]?.url)
    }, [product])


    function addToCart() {
        dispatch(addToCartThunk({
            productID: product._id,
            quantity: 1,
            attributes: product.attributes
        }));
        navigate("/cart");
    }

    function buyNow() {
        dispatch(buyNowThunk({
            productID: product._id,
            quantity: 1,
            attributes: product.attributes
        }));
        navigate("/checkout?mode=buynow");
    }

    function getDeliveryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };


    if (productLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                Product Not Found
            </div>
        )
    }


    // if (wishlistAdding) {
    //     return (
    //         <div className="w-full h-screen flex justify-center items-center">
    //             <Loader2 className="animate-spin"></Loader2>
    //         </div>
    //     )
    // }


    return (
        <div className="w-full bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <nav className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="hover:text-amber-600 cursor-pointer">Home</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="hover:text-amber-600 cursor-pointer">{product?.category?.name}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-medium truncate max-w-[120px]">
                            {product?.brand} {product?.name}
                        </span>
                    </nav>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 p-4">
                    {/* IMAGE GALLERY */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4">
                        {/* Thumbnail Strip */}
                        <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                            {product.images?.map((img, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 lg:w-14 lg:h-14 border rounded cursor-pointer transition-all duration-200 p-0.5 ${mainImage === img.url
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setMainImage(img.url)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 order-1 lg:order-2">
                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-center items-center min-h-[300px] lg:min-h-[400px]">
                                <img
                                    src={mainImage}
                                    alt={product?.name}
                                    className="max-w-full max-h-[280px] lg:max-h-[350px] object-contain transition-transform duration-300"
                                />
                            </div>

                            {/* Image Actions */}
                            <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 text-xs border-gray-300 hover:bg-gray-50">
                                    <Share2 className="w-3 h-3 mr-1" />
                                    Share
                                </Button>
                                <Button onClick={handleAddWishlist} variant="outline" size="sm" className="flex-1 text-xs border-gray-300 hover:bg-gray-50">
                                    <Heart className={`w-3 h-3 mr-1 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
                                    Wishlist
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator className="lg:hidden" />

                    {/* PRODUCT DETAILS */}
                    <div className="flex-1 lg:max-w-2xl">
                        <div className="space-y-4">
                            {/* Title & Brand */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {product?.brand}
                                    </span>
                                    {product.isAssured && (
                                        <Badge className="bg-green-600 text-white px-2 py-0 text-xs h-5">
                                            <Shield className="w-2 h-2 mr-1" />
                                            Assured
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-lg lg:text-xl font-semibold text-gray-900 leading-snug">
                                    {product?.brand} {product?.name} {product?.attributes?.storage} {product?.attributes?.colour}
                                </h1>
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="font-semibold text-xs">4.5</span>
                                    </div>
                                    <span className="text-gray-600 text-xs">1,200 Ratings</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="text-gray-600 text-xs">
                                    <span className="font-medium">320 Reviews</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="text-gray-600 text-xs">
                                    <span className="font-medium">2,000+</span> Sold
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-1 p-3 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{product?.price?.toLocaleString("en-IN")}
                                    </span>
                                    {product?.salePrice > 0 && (
                                        <>
                                            <span className="line-through text-base text-gray-500">
                                                ₹{product.salePrice.toLocaleString("en-IN")}
                                            </span>
                                            <Badge className="bg-green-600 text-white text-xs">
                                                {Math.round((1 - product.price / product.salePrice) * 100)}% OFF
                                            </Badge>
                                        </>
                                    )}
                                </div>
                                {product?.salePrice > 0 && (
                                    <p className="text-xs text-green-600 font-medium">
                                        You save ₹{(product.salePrice - product.price).toLocaleString("en-IN")}
                                    </p>
                                )}
                            </div>

                            {/* Highlights */}
                            <div className="">
                                <h3 className="font-semibold text-gray-900 text-base">Key Features</h3>
                                <div className="grid gap-1">
                                    {product?.highlights?.map((line, index) => (
                                        <div key={index} className="flex items-start gap-2 p-1 hover:bg-gray-50 rounded">
                                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="p-3 rounded-lg border border-gray-200 text-sm">
                                {product.outOfStock ? (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <XCircle className="w-4 h-4" />
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                ) : product.stock < 5 ? (
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        <div>
                                            <span className="font-medium">Hurry! Only {product.stock} left</span>
                                            <p className="text-xs text-orange-500">Limited stock available</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <div>
                                            <span className="font-medium">In Stock</span>
                                            <p className="text-xs text-green-500">Available for immediate delivery</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <Button
                                    onClick={addToCart}
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 text-sm"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    onClick={buyNow}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 text-sm"
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Buy Now
                                </Button>
                            </div>

                            {/* Delivery Info */}
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-blue-700">
                                        <Truck className="w-4 h-4" />
                                        <span className="font-medium">Free Delivery</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-4" />
                                    <div className="flex items-center gap-1 text-green-700">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">Delivery by {getDeliveryDate()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FULL DESCRIPTION */}
                <div className="border-t border-gray-200 pb-6 border-b">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-500" />
                            Product Description
                        </h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                                {product?.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Reviews Section */}
                <ProductReview  ></ProductReview>
            </div>
        </div>
    );
};


export const ProductReview = () => {

    const { slug } = useParams();
    const id = slug?.split("-").pop();

    const { data, } = useProductReviews({ productID: id })
    const reviews = data?.reviews ?? []

    function calculateRatingStats() {
        if (!reviews || reviews.length === 0) return null;

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        return {
            averageRating: averageRating?.toFixed(1),
            totalReviews,
            ratingDistribution
        };
    };

    const ratingStats = calculateRatingStats();
    return (
        <div className="border-gray-200">
            <div className="p-4">
                {
                    reviews.length > 0 &&
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        Customer Reviews
                    </h2>
                }
                <div className="space-y-8">
                    {/* Rating Overview Card */}
                    {ratingStats && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Overall Rating */}
                                <div className="text-center">
                                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-sm border border-amber-200">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {ratingStats.averageRating}
                                            </div>
                                            <div className="flex justify-center gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-3 h-3 ${star <= Math.round(ratingStats.averageRating)
                                                            ? "text-amber-500 fill-current"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {ratingStats.totalReviews} reviews
                                    </p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const percentage = ratingStats.totalReviews > 0
                                            ? (ratingStats.ratingDistribution[rating] / ratingStats.totalReviews) * 100
                                            : 0;
                                        return (
                                            <div key={rating} className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-1 w-12">
                                                    <span className="text-gray-600">{rating}</span>
                                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                                </div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-gray-600 text-xs w-10">
                                                    {ratingStats.ratingDistribution[rating]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Review Summary */}
                                <div className="text-center md:text-right">
                                    <div className="flex items-center justify-center md:justify-end gap-1 mb-2">
                                        <ThumbsUp className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {Math.round((ratingStats.ratingDistribution[5] + ratingStats.ratingDistribution[4]) / ratingStats.totalReviews * 100)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">Positive reviews</p>
                                    <p className="text-xs text-gray-500 mt-1">Based on customer feedback</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Reviews List */}
                    <div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Customer Reviews ({reviews?.length || 0})
                        </h3>

                        {!reviews || reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* User Avatar */}
                                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold text-lg shadow-inner border border-amber-200">
                                                {review?.user?.username
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </div>

                                            <div className="flex-1">
                                                {/* User Info and Rating */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {review?.user?.username || "Anonymous User"}
                                                        </p>
                                                        <span className="text-gray-500 text-sm">
                                                            {formatDate(review.createdAt)}
                                                        </span>
                                                    </div>

                                                    {/* Rating Stars */}
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-4 h-4 ${star <= review?.rating ? "text-amber-500 fill-current" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                                            {review.rating}.0
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {review.comment}
                                                </p>

                                                {/* Review Image */}
                                                {review?.image?.url && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={review.image.url}
                                                            alt="Review attachment"
                                                            className="w-32 h-32 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProductDetails;



