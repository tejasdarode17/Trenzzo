import { useWishlist } from "@/hooks/shopper/useWishlist"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2, Star, Truck } from "lucide-react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addProductToWishlist } from "@/api/shopper.api"
import WishlistSkeleton from "./WishlistSkelton"
import { useAddToCart } from "@/hooks/shopper/useAddToCart"

const Wishlist = () => {

    const { isAuthenticated } = useSelector((store) => store.auth)
    const { data: wishlist = [], isLoading } = useWishlist()

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: removeFromWishlist } = useMutation({
        mutationFn: addProductToWishlist,
        onSuccess: () => queryClient.invalidateQueries(["wishlist"]),
    })


    if (!isAuthenticated) {
        return <Navigate to="/" replace></Navigate>
    }



    const { mutate: addToCart } = useAddToCart()
    function handleAddTocart(product) {
        addToCart({
            productID: product._id,
            quantity: 1,
            attributes: product.attributes,
        })
        navigate("/cart")
    }


    const goToProduct = (slug) => navigate(`/product/${slug}`)

    if (isLoading) return <WishlistSkeleton />

    if (!wishlist.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-pink-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                        Your Wishlist is Empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Save items you love and find them here later.
                    </p>
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                        My Wishlist ({wishlist.length})
                    </h1>
                </div>

                {/* Grid */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl border hover:shadow-md transition flex flex-col overflow-hidden"
                        >
                            {/* Image */}
                            <div
                                className="relative aspect-square bg-gray-100 cursor-pointer"
                                onClick={() => goToProduct(product.slug)}
                            >
                                <img
                                    src={product.images?.[0]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    aria-label="Remove from wishlist"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFromWishlist({ productID: product._id })
                                    }}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:text-red-600 focus:outline-none"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                {product.outOfStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {product.brand && (
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {product.brand}
                                        </span>
                                    )}
                                    <Badge className="bg-green-600 text-white text-xs h-5">
                                        Assured
                                    </Badge>
                                </div>

                                <h3
                                    className="text-sm font-semibold line-clamp-2 cursor-pointer hover:text-amber-600"
                                    onClick={() => goToProduct(product.slug)}
                                >
                                    {product.brand} {product.name} {product.attributes?.storage}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
                                        <Star className="w-3 h-3 fill-current" />
                                        4.5
                                    </div>
                                    <span className="text-gray-500">1,200 ratings</span>
                                </div>

                                {/* Price */}
                                <div>
                                    <p className="text-base sm:text-lg font-bold">
                                        ₹{product.price?.toLocaleString("en-IN")}
                                    </p>
                                    {product.salePrice > product.price && (
                                        <p className="text-xs text-gray-500 line-through">
                                            ₹{product.salePrice.toLocaleString("en-IN")}
                                        </p>
                                    )}
                                </div>

                                {/* Delivery */}
                                <div className="flex items-center gap-2 text-xs text-green-600">
                                    <Truck className="w-3 h-3" />
                                    Free delivery
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => goToProduct(product.slug)}
                                    >
                                        View
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60"
                                        disabled={product.outOfStock}
                                        onClick={() => handleAddTocart(product)}
                                    >
                                        Add To Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist
