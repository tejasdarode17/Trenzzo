import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Share2, Heart, Shield, Star, CheckCircle, XCircle, AlertTriangle, Truck, Calendar, FileText, ShoppingCart, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductDetail } from "@/hooks/shopper/useProductDetail";
import { useWishlist } from "@/hooks/shopper/useWishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductToWishlist } from "@/api/shopper.api";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import MobileProductImageCarousel from "./MobileProductImageCarousel";
import MobileStickyBuyBar from "./MobileStickyBuyBar";
import ProductReviews from "./ProductReviews";
import { useAddToCart } from "@/hooks/shopper/useAddToCart";
import { useInitCheckout } from "@/hooks/shopper/useInitCheckout";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProductDetails = () => {

    const [mainImage, setMainImage] = useState(null)
    const navigate = useNavigate()
    const { slug } = useParams()

    const { isAuthenticated } = useSelector((s) => s.auth);

    const { data, isLoading: productLoading, error } = useProductDetail({ slug })
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
    })

    function handleAddWishlist() {
        if (isAuthenticated) {
            addToWishlist({ productID: product?._id })
        } else {
            toast.error("Please Sign in first")
        }
    }

    useEffect(() => {
        setMainImage(product?.images?.[0]?.url)
    }, [product])



    const { mutate: addToCartHandler, isPending: addToCartLoading } = useAddToCart()
    function addToCart() {
        if (isAuthenticated) {
            addToCartHandler({
                productID: product._id,
                quantity: 1,
                attributes: product.attributes
            },
                { onSuccess: () => navigate("/cart") }
            )
        } else {
            toast.error("Please Sign in first")
        }
    }


    const { mutate: initCheckout, isPending: onBuyNowLoading } = useInitCheckout();
    function handleBuyNow(productID, quantity, attributes) {
        if (isAuthenticated) {

            initCheckout({
                source: "buy_now",
                productID,
                quantity,
                attributes,
            },
                { onSuccess: () => navigate("/checkout?source=buy_now") }
            )
        } else {
            toast.error("Please Sign in first")
        }
    }


    function getDeliveryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    if (productLoading) {
        return <ProductDetailsSkeleton />
    }

    return (
        <div className="w-full bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb - Desktop only */}
                <div className="hidden lg:block px-4 py-3 border-b border-gray-100">
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

                <div className="flex flex-col lg:flex-row gap-4 p-3 lg:p-4">
                    {/* IMAGE GALLERY */}
                    <div className="flex-1">

                        {/* Mobile Image Carousel */}
                        <div className="lg:hidden mb-4">
                            <MobileProductImageCarousel images={product?.images} />
                        </div>

                        <div>
                            {/* Desktop Image Section */}
                            <div className="hidden lg:flex lg:flex-row gap-4">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-2">
                                    {product?.images?.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`w-14 h-14 border rounded cursor-pointer transition-all duration-200 p-0.5 ${mainImage === img.url
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

                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-center items-center min-h-[400px]">
                                        <img
                                            src={mainImage}
                                            alt={product?.name}
                                            className="max-w-full max-h-[350px] object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Actions */}
                        <div className="flex gap-2 mt-3 lg:mt-3">
                            <Button variant="outline" size="sm" className="flex-1 text-xs border-gray-300 hover:bg-gray-50">
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                            </Button>
                            <Button
                                onClick={handleAddWishlist}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs border-gray-300 hover:bg-gray-50"
                                disabled={wishlistAdding}
                            >
                                <Heart className={`w-3 h-3 mr-1 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
                                {wishlistAdding ? <Loader2 className="animate-spin mx-auto"></Loader2> : "Wishlist"}
                            </Button>
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
                                    {product?.isAssured && (
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

                            {/* Rating & Reviews - Mobile Compact */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="font-semibold text-xs">4.5</span>
                                    </div>
                                    <span className="text-gray-600">1,200 ratings</span>
                                </div>
                                <Separator orientation="vertical" className="h-3" />
                                <div className="text-gray-600">
                                    <span className="font-medium">320 reviews</span>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-1 p-3 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-100">
                                <div className="flex items-center gap-3 flex-wrap">
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
                                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-2">Key Features</h3>
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
                                {product?.outOfStock ? (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <XCircle className="w-4 h-4" />
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                ) : product?.stock < 5 ? (
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

                            {/* Delivery Info */}
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1 text-blue-700">
                                        <Truck className="w-4 h-4" />
                                        <span className="font-medium">Free Delivery</span>
                                    </div>
                                    <Separator orientation="vertical" className="hidden sm:block h-4" />
                                    <div className="flex items-center gap-1 text-green-700">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">Delivery by {getDeliveryDate()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex gap-3">
                                <Button
                                    onClick={addToCart}
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 text-sm"
                                >
                                    {addToCartLoading ? <Loader2 className="animate-spin mx-auto"></Loader2> : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add To Cart
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => handleBuyNow(product?._id, 1, product?.attributes)}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 text-sm"
                                >
                                    {onBuyNowLoading ? <Loader2 className="animate-spin mx-auto"></Loader2> : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Buy now
                                        </>
                                    )}
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>


                {/* FULL DESCRIPTION */}
                <div className="border-t border-gray-200 pb-6">
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
                <ProductReviews />
            </div>

            {/* Mobile Sticky Buy Bar - Fixed */}
            <MobileStickyBuyBar
                onAddToCart={addToCart}
                addToCartLoading={addToCartLoading}
                onBuyNow={() => handleBuyNow(product._id, 1, product.attributes)}
                onBuyNowLoading={onBuyNowLoading}
                product={product}
            />

        </div>
    );
};



export default ProductDetails